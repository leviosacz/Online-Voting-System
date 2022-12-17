import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, content):
    '''
    {
     vote_title:
     date:
     optionNum:
     }

    '''
    response = {'statusCode': 200}
    dynamodb = boto3.resource('dynamodb', region_name=('us-west-2'))
    votesList = dynamodb.Table('votesList')
    voteOptionList = dynamodb.Table('voteOptionsList')
    
    check = votesList.delete_item(
        Key = {
            "title":event["vote_title"],
            "date": event["date"]
            }
        )
    
    check2 = voteOptionList.delete_item(
        Key = {
            "title":event["vote_title"],
            "optionNum": event["optionNum"]
            }
        )
    
    if (check["ResponseMetadata"]["HTTPStatusCode"] == 200):
        if (check2["ResponseMetadata"]["HTTPStatusCode"] == 200):    
            response["statusCode"] = "200"
        else:
            response["statusCode"] = '402'
    else:
        response["statusCode"] = '401'
    
    return response
