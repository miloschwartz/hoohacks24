import json

def upload_contents(data):
    pass

def main() -> None:
    with open('db.json', encoding='utf-8') as f:
        contents = json.load(f)
        upload_contents(contents)


if __name__ == '__main__':
    main()
