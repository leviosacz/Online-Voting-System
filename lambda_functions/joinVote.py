import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, content):
    '''
    {
     vote_title:
     date:
     optionNum:
     option:
     }

    '''
    response = {'statusCode': 200}
    if updateVoteList(event["vote_title"], event["date"]):    
        response["body"] = updateVoteOption(event)
    else:
        response["statusCode"]=400
    
    return response

def updateVoteList(table,date):
    dynamodb = boto3.resource('dynamodb', region_name=('us-west-2'))
    votesList = dynamodb.Table('votesList')
    
    # update voteOptionList
    item = votesList.query(
        KeyConditionExpression = Key('title').eq(table)
        )
    
    item = item["Items"][0]
    old_value = item['voters']
    
    check = votesList.update_item(
        Key = {
            "title": table,
            "date": date
            },
        AttributeUpdates = {
            'voters':{"Value":old_value+1, "Action":'PUT'}
            },
        ReturnValues = 'UPDATED_NEW'
        )
    
    if check["Attributes"]['voters'] == old_value+1:
        return True
    else:
        return False
    
def updateVoteOption(event):
    dynamodb = boto3.resource('dynamodb', region_name=('us-west-2'))
    voteOptionList = dynamodb.Table('voteOptionsList')
    
    # update voteOptionList
    item = voteOptionList.query(
        KeyConditionExpression = Key('title').eq(event["vote_title"])
        )
    
    item = item["Items"][0]
    old_value = item[event["option"]+'_voters']
    
    voteOptionList.update_item(
        Key = {
            "title": event["vote_title"],
            "optionNum": event["optionNum"]
            },
        AttributeUpdates = {
            event["option"]+'_voters':{"Value":old_value+1, "Action":'PUT'}
            },
        ReturnValues = 'UPDATED_NEW'
        )
    
    body=[]
    for i in range(1,int(item["optionNum"])+1):
        if 'option'+str(i) == event["option"]:
            body.append(item['option'+str(i)+'_voters']+1)
        else:
            body.append(item['option'+str(i)+'_voters'])
            
    return body
    