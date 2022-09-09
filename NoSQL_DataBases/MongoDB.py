from pymongo import MongoClient
import requests, json, time

client = MongoClient("mongodb://localhost:27017/")
database = client["sahamyab"]
collection = database["tweets"]
total = 1000
fetched = 0
seenIds = set()
timer=0

while fetched < total :
    response = requests.get(url='https://www.sahamyab.com/guest/twiter/list?v=0.1',headers={'User-Agent':'Chrome/61'})
    data = response.json()["items"]
    for tweet in data:
        if tweet["id"] not in seenIds: 
            try:
               collection.insert_one(tweet)
               seenIds.add(tweet["id"])
               fetched +=1
               print("tweet " + str(tweet["id"]) + "fetched,   total: " + str(fetched))
            except Exception as e:
               print(e)

    time.sleep(60)
    timer +=1

   