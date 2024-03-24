import json
import boto3

client = boto3.client('batch')

def upload_contents(data):


def main() -> None:
    with open('db.json', encoding='utf-8') as f:
        contents = json.load(f)
        upload_contents(contents)


if __name__ == '__main__':
    main()
