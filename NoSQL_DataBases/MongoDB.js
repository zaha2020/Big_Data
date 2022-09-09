//------------------game 2------------------------
//preprocessing

db.tweets.aggregate([
        { "$addFields": { 
            "hashtag": { $regexFindAll: { input: "$content", regex: "#[\u0600-\u06FF\s0-9\_]+" }} 
        }},
       { $set: { hashtag: "$hashtag.match"} },
       { "$out": "tweets" }
])


db.tweets.find().forEach(function(mydoc) {
    mydoc.content=mydoc.content.replace(/\"\u0643" /g,"\u06A9");//replace arabic ك  with persian ک
    mydoc.content=mydoc.content.replace(/\"\u064A"/g,"\u06CC"); //replace arabic ي  with persian ی
    db.tweets.save(mydoc);
});


///split day for some steps
db.tweets.aggregate([
    {$addFields
        : {"day": {$arrayElemAt:[{$split: ["$sendTimePersian" , " "]}, 0]}}},
    {$addFields
        : {"day": {$arrayElemAt:[{$split: ["$day" , "/"]}, -1]}}},
         { "$out": "tweets" }
])
 

///split hours for some steps

db.tweets.aggregate([
    {$addFields:
         {"hour": {$arrayElemAt:[{$split: ["$sendTimePersian" , " "]}, 1]}}},
    {$addFields:
         {"hour": {$arrayElemAt:[{$split: ["$hour" , ":"]}, 0]}}},
         { "$out": "tweets" }
])

///split minutes for some steps
db.tweets.aggregate([
    {$addFields:
         {"min": {$arrayElemAt:[{$split: ["$sendTimePersian" , " "]}, 1]}}},
    {$addFields:
         {"min": {$arrayElemAt:[{$split: ["$min" , ":"]}, 1]}}},
         { "$out": "tweets" }
])

//------------------game 3------------------------
//1
db.tweets.find({ 
    '$and':
    [{"mediaContentType":{"$eq": "image/jpeg"}},
    { parentId: { $exists: true } }]  
    },
{
           "_id" :0,
            "parentId": 1,   
            
})
//2
db.tweets.updateMany(
    {hashtag: { $in: ["#شبندر","#شستا","#فولاد"] }},
    {$set: { gov:true } }) //If the field does not exist,$set will add a new field with the specified value

db.tweets.find

//db.tweets.find({
   // hashtag: { $in: ["#شبندر","#شستا","#فولاد"] }     



//3
var first = "11";
var last = "12"; 
var min1="00";  
var min2="59";
db.tweets.find({
    '$and':
    [{
    "hour": {$gte: first, $lte: last}},
    {"min": {$gte: min1, $lte: min2}}
    ]
},
{
"_id" :0,
            "senderName": 1,  
            "senderProfileImage":1,
            "sendTimePersian":1

})
//------------------game 4------------------------
//1
db.tweets.aggregate([
     { "$group" : { 
       "_id" : "$senderName", 
       "count" : { "$sum" : 1 }}},
              
        { 
            "$project" : { 
                "tweetGroup" : { 
                    "$cond" : { 
                        "if" : { "$eq" : ["$count", 1] },  
                        "then" : "one tweet", 
                        "else" : { 
                            "$cond" : { 
                                "if" : { "$eq" : ["$count", 2] },  
                                "then" : "two tweets", 
                                "else" : "three & more than three tweets"
                            }
                        }
                    }
                }
            }
        }
          ,
          {$group :{_id : "$tweetGroup",count:{$sum:1}}}
          
])
//2
db.tweets.aggregate( [ { $unwind: "$hashtag" },  { $sortByCount: "$hashtag" } ] )
//The following operation unwinds the tags array and uses the $sortByCount 
//stage to count the number of documents associated with each tag: &sorted in descending order by count:
//
//3
db.tweets.updateMany(
   { parentId: { $exists: true } },
   { $unset: { type: ""}}
)
db.tweets.find({
   parentId: { $exists: true }}  )

//4
db.tweets.aggregate( [
  {$facet: {
      "hashtagsort": [
        { $unwind: "$hashtag" },
        { $sortByCount: "$hashtag" }
      ]}
  },
  { "$project": { 
        maxfrequent: { $first: "$hashtagsort" },
        minfrequent: { $last: "$hashtagsort" }
    }}
  ])
  
//5
db.tweets.aggregate( [
{$sort: { sendTimePersian: 1}},
  { "$project": { 
        day: "$sendTimePersian" 
    }}
])
db.tweets.aggregate([
{ $unwind: "$hashtag" },
    { "$group": {
        "_id": {
            "hashtag": "$hashtag",
            "day": "$day",
        },
        "tCount": { "$sum": 1 }
    }},
     {$sort: { day: 1,tCount:-1}},
    { "$group": {
        "_id": "$_id.day",
        "tweets": { 
            "$push": { 
                "hashtag": "$_id.hashtag",
                "count1": "$tCount"
            },
        },
        
       // "count2": { "$sum": "$tCount" },
    }},
   {$project:{tweets:{$slice:["$tweets", 10]}}},
   //{"$sort": { "count2": 1  }},
])
//6
db.tweets.aggregate([
    { "$group": {
        "_id": {
            "senderName": "$senderName",
            "day": "$day",
          
        },
        "tCount": { "$sum": 1 }
    }},
     {$sort: { day: 1,tCount:-1}},
    { "$group": {
        "_id": "$_id.day",
        "tweets": { 
            "$push": { 
                "senderName": "$_id.senderName",
                "count1": "$tCount"
            },
        },
        
       // "count2": { "$sum": "$tCount" },
    }},
   {$project:{tweets:{$slice:["$tweets", 1]}}},
   //{"$sort": { "count2": 1  }},
])


//----gam6
db.tweets.find({"type":{$eq: "retwit"}}).forEach(function(doc) {
    db.retweets.insert(doc);
    db.tweets.remove(doc);
});