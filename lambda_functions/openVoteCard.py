import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, content):
    '''
    {
     vote_title:
     }

    '''
    response = {'statusCode': 200}
    body={}
    dynamodb = boto3.resource('dynamodb', region_name=('us-west-2'))
    votesList = dynamodb.Table('votesList')
    voteOptionList = dynamodb.Table('voteOptionsList')
    
    # find sponsor name
    item0 = votesList.query(
        KeyConditionExpression = Key('title').eq(event["vote_title"])
        )
    item0 = item0["Items"][0]
    body["sponsor"] = item0["sponsor"]
    
    item = voteOptionList.query(
        KeyConditionExpression = Key('title').eq(event["vote_title"])
        )
    
    item = item["Items"][0]
    
    body["vote_title"] = item["title"]
    body["pic"] = item["picNum"]
    body["date"] = item0["date"]
    body["voters"] = item0["voters"]
    body["options"] = []
    
    for i in range(1, int(item["optionNum"])+1):
        body["options"].append(item["option"+str(i)])

    response["body"] = body

    return response    