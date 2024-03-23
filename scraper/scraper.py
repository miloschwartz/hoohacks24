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
        current_content = driver.find_element(*self.locator).text
        return current_content != self.initial_content


CHROMEDRIVER_PATH = r"./chromedriver"
chrome_options = Options()
service = Service(executable_path=CHROMEDRIVER_PATH)
driver = webdriver.Chrome(service=service, options=chrome_options)

try:
    driver.get("https://leetcode.com/problems/longest-palindromic-substring/")

    time.sleep(2)

    # # TODO: normalize data (i.e. test cases -> objects)
    # # id = <in for loop>
    # title = driver.find_element(
    #     By.CSS_SELECTOR,
    #     'a[class="no-underline hover:text-blue-s dark:hover:text-dark-blue-s truncate cursor-text whitespace-normal hover:!text-[inherit]"]',
    # ).text
    # # todo: get div child
    # description = driver.find_element(
    #     By.CSS_SELECTOR, 'div[data-track-load="description_content"]'
    # ).get_attribute('outerHTML')
    # topics_parent = driver.find_element(
    #     By.CSS_SELECTOR, 'div[class="mt-2 flex flex-wrap gap-1 pl-7"]'
    # )
    # topics = [
    #     topic.get_attribute('textContent')
    #     for topic in topics_parent.find_elements(By.TAG_NAME, 'a')
    # ]

    # hints: list[str] = []
    # for hintElement in driver.find_elements(
    #     By.CSS_SELECTOR,
    #     'div[class="text-body text-sd-foreground mt-2 pl-7 elfjS"]',
    # ):
    #     hints.append(hintElement.get_attribute('textContent'))

    boilerplate = driver.find_element(
        By.CSS_SELECTOR, 'div[class="view-lines monaco-mouse-cursor-text"]'
    ).text

    # click menu
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable(
            (
                By.CSS_SELECTOR,
                'button[class="rounded items-center whitespace-nowrap focus:outline-none inline-flex bg-transparent dark:bg-dark-transparent text-text-secondary dark:text-text-secondary active:bg-transparent dark:active:bg-dark-transparent hover:bg-fill-secondary dark:hover:bg-fill-secondary px-1.5 py-0.5 text-sm font-normal group"]',
            )
        )
    ).click()

    driver.find_element(By.XPATH, "//div[normalize-space()='Python3']").click()

    locator = (
        By.CSS_SELECTOR,
        'div[class="view-lines monaco-mouse-cursor-text"]',
    )

    try:
        WebDriverWait(driver, 10).until(textchanged(locator, boilerplate))
        boilerplate = driver.find_element(*locator).text
    except TimeoutException:
        print("The content did not change within the expected time.")

    # print(f'title: {title}')
    # print(f'description: {description}')
    # print(f'topics: {topics}')
    # print(f'hints: {hints}')
    # print(f'boilerplate: {boilerplate}')

finally:
    driver.quit()
