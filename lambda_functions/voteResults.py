import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, content):
    '''
    {
     vote_title:
     }

    '''
    response = {'statusCode': 200, "body":[]}
    
    dynamodb = boto3.resource('dynamodb', region_name=('us-west-2'))
    voteOptionList = dynamodb.Table('voteOptionsList')
    
    # query voteOptionList
    item = voteOptionList.query(
        KeyConditionExpression = Key('title').eq(event["vote_title"])
        )
    
    item = item["Items"][0]
    
    body=[]
    for i in range(1,int(item["optionNum"])+1):
        body.append(item['option'+str(i)+'_voters'])
    
    response["body"]=body
    return response
