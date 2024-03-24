import json
import time

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


class textchanged(object):
    def __init__(self, locator, initial_content):
        self.locator = locator
        self.initial_content = initial_content

    def __call__(self, driver):
        current_content = backoff(lambda: driver.find_element(*self.locator).text)
        return current_content != self.initial_content


CHROMEDRIVER_PATH = r"./chromedriver"
chrome_options = Options()
service = Service(executable_path=CHROMEDRIVER_PATH)


def make_driver():
    return webdriver.Chrome(service=service, options=chrome_options)

def backoff(function, max_attempts=5, initial_wait=1.0, backoff_factor=2.0):
    wait_time = initial_wait
    for attempt in range(max_attempts):
        try:
            return function()
        except TimeoutException as e:
            print(f"Attempt {attempt + 1} failed with {e}. Retrying in {wait_time} seconds.")
            time.sleep(wait_time)
            wait_time *= backoff_factor
    raise TimeoutException(f"All {max_attempts} attempts failed.")

def scrape_and_write_problems(problem_link):
    driver = make_driver()
    try:
        hit_url(driver, problem_link)
        root = backoff(lambda: driver.find_element(
            By.XPATH, '//div[h2[text()="List of Problems"]]'
        ))
        tbody = backoff(lambda: root.find_element(By.XPATH, './following::tbody[1]'))

        tds = backoff(lambda: tbody.find_elements(By.CSS_SELECTOR, 'td')[3:])

        for i in range(0, len(tds), 3):
            group = tds[i : i + 3]

            problem_link_element = backoff(lambda: group[1].find_element(By.TAG_NAME, 'a'))
            solution_link_element = backoff(lambda: group[2].find_element(By.TAG_NAME, 'a'))

            print(f'processing problem {problem_link}')
            problem_link = problem_link_element.get_attribute('href')
            solution_link = solution_link_element.get_attribute('href')

            try:
                problem = (
                    {'id': i}
                    | {'solution': scrape_solution(solution_link)}
                    | scrape_leetcode(problem_link)
                )
                with open('db.json', encoding='utf-8') as f:
                    contents = json.load(f)
                    if problem['id'] not in contents['problems']:
                        print(f'already wrote problem {problem} - skipping')
                    else:
                        contents['problems'][problem['id']] = problem
                        print(f'writing problem {problem}')
                        with open('db.json', 'w', encoding='utf-8') as f:
                            json.dump(contents, f)

                print(f'scraped problem {problem['id']}; sleeping 10s')
                time.sleep(10)
            except:
                print(f'failed to scrape {problem_link}')
    finally:
        driver.quit()


def hit_url(driver, solution_link):
    print(f'hit url {solution_link}; sleeping 3s')
    driver.get(solution_link)
    time.sleep(3)


def scrape_solution(solution_link):
    driver = make_driver()

    solution = None

    try:
        hit_url(driver, solution_link)
        solution = backoff(lambda: driver.find_element(
            By.XPATH, '//textarea[@aria-label="file content"]'
        ).get_attribute('value'))

    finally:
        driver.quit()

    return solution


def scrape_leetcode(problem_link):
    driver = make_driver()
    try:
        hit_url(driver, problem_link)

        # TODO: normalize data (i.e. test cases -> objects)
        title = backoff(lambda: driver.find_element(
            By.CSS_SELECTOR,
            'a[class="no-underline hover:text-blue-s dark:hover:text-dark-blue-s truncate cursor-text whitespace-normal hover:!text-[inherit]"]',
        ).text)
        title = title[title.index(' ') + 1:]
        description = backoff(lambda: driver.find_element(
            By.CSS_SELECTOR, 'div[data-track-load="description_content"]'
        ).get_attribute('innerHTML'))
        topics_parent = backoff(lambda: driver.find_element(
            By.CSS_SELECTOR, 'div[class="mt-2 flex flex-wrap gap-1 pl-7"]'
        ))
        topic_as = backoff(lambda: topics_parent.find_elements(By.TAG_NAME, 'a'))
        topics = [
            topic.get_attribute('textContent')
            for topic in topic_as
        ]

        hints: list[str] = []
        hint_es = backoff(lambda: driver.find_elements(
            By.CSS_SELECTOR,
            'div[class="text-body text-sd-foreground mt-2 pl-7 elfjS"]',
        ))
        for hintElement in hint_es:
            hints.append(hintElement.get_attribute('textContent'))

        boilerplate = backoff(lambda: driver.find_element(
            By.CSS_SELECTOR, 'div[class="view-lines monaco-mouse-cursor-text"]'
        ).text)

        # click menu
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (
                    By.CSS_SELECTOR,
                    'button[class="rounded items-center whitespace-nowrap focus:outline-none inline-flex bg-transparent dark:bg-dark-transparent text-text-secondary dark:text-text-secondary active:bg-transparent dark:active:bg-dark-transparent hover:bg-fill-secondary dark:hover:bg-fill-secondary px-1.5 py-0.5 text-sm font-normal group"]',
                )
            )
        ).click()

        backoff(lambda: driver.find_element(
            By.XPATH, "//div[normalize-space()='Python3']"
        ).click())

        locator = (
            By.CSS_SELECTOR,
            'div[class="view-lines monaco-mouse-cursor-text"]',
        )

        try:
            WebDriverWait(driver, 10).until(textchanged(locator, boilerplate))
            boilerplate = backoff(lambda: driver.find_element(*locator).text)
        except TimeoutException:
            print("The content did not change within the expected time.")

    finally:
        driver.quit()

    return {
        'title': title,
        'description': description,
        'topics': topics,
        'hints': hints,
        'boilerplate': boilerplate,
    }


# print(scrape_solution('https://github.com/cnkyrpsgl/leetcode/blob/master/solutions/python3/1201.py'))
# print(scrape_leetcode('https://leetcode.com/problems/two-sum/'))
scrape_and_write_problems('https://git ub.com/cnkyrpsgl/leetcode')
