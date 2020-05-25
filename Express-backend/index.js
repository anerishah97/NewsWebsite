const express = require('express');
const got = require('got');
const googleTrends = require('google-trends-api');
const app = express();
var cors = require('cors')
require('dotenv').config()

const nytAPIKey = process.env.API_KEY_NYT;
const guardianAPIKey = process.env.API_KEY_GUARDIAN;

const guardianHomeURL = "https://content.guardianapis.com/";
const nytHomeURL = "https://api.nytimes.com/svc/topstories/v2/";

const defaultGuardianImage = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
const defaultNYTImage = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";

app.use(cors())

app.listen(8080, ()=>{
    console.log("Server running");
});

//returns top 10 guardian headlines used in the Android application
app.get("/top-guardian-android", (req,res,next)=>{
    var searchURL = "https://content.guardianapis.com/search?order-by=newest&show-fields=starRating,headline,thumbnail,short-url&api-key=" + guardianAPIKey;
    (async () => {
        try {
            const response = await got(searchURL);
            var jsonResponse = JSON.parse(response.body);
            var modifiedJSONResponse = androidGuardian(jsonResponse);
            res.send(modifiedJSONResponse);
        } catch (error) {
            console.log(error);
        }
    })();

})


//returns top 10 guardian headlines used in the React website
app.get("/guardian-home", (req, res, next) => {
    var jsonResponse; 
    var searchURL= guardianHomeURL+ "search?api-key="+guardianAPIKey+"&section=sport|business|technology|politics&show-blocks=all";
    //console.log(searchURL);
    (async () => {
        try {
            const response = await got(searchURL);
            var jsonResponse = JSON.parse(response.body);
            var modifiedJSONResponse = homePageGuardian(jsonResponse);
            res.send(modifiedJSONResponse);
        } catch (error) {
            console.log(error);
        }
    })();
   });


//returns top 10 headlines from Guardian related to the section passed in the GET request
app.get("/guardian-section", (req,res,next)=>{
    var section = req.query.section;
    var searchURL = guardianHomeURL+section+"?api-key="+guardianAPIKey+"&show-blocks=all";
    console.log(searchURL);
    (async () => {
        try {
            const response = await got(searchURL);
            var jsonResponse = JSON.parse(response.body);
            console.log(jsonResponse);
            var modifiedJSONResponse = sectionGuardian(jsonResponse);
            res.send(modifiedJSONResponse);
        } catch (error) {
            console.log(error);
        }
    })();
});


//returns google trends for a keyword from 2019-01-06 to current date
app.get("/trends", (req,res,next)=>{
    var searchTerm = req.query.keyword;
    jsonResponse = {}
    var dateString = "06/01/2019"
    let query = {
        keyword: searchTerm,
        startTime:new Date(dateString)
    };
    googleTrends.interestOverTime(query, function(err, results){
        if(err) console.error('there was an error!', err);
        else{ 
            jsonResponse["response"] = JSON.parse(results);
            res.send(jsonResponse);
        }
      })
});


//returns top headlines from NYT
app.get("/nyt-home", (req,res,next)=>{
    var searchURL = nytHomeURL+"home.json?api-key=" + nytAPIKey;
    console.log(searchURL);
        (async () => {
        try {
            const response = await got(searchURL);
            var jsonResponse = JSON.parse(response.body);
            var modifiedJSONResponse = homeNYT(jsonResponse);
            res.send(modifiedJSONResponse);
        } catch (error) {
            console.log(error);
        }
    })();
});

//returns top headlines in a particular section from NYT
app.get("/nyt-section", (req, res, next)=>{
    var section = req.query.section;
    var searchURL = nytHomeURL+section+".json?api-key=" + nytAPIKey;
    console.log(searchURL);
    (async () => {
        try {
            const response = await got(searchURL);
            var jsonResponse = JSON.parse(response.body);
            var modifiedJSONResponse = sectionNYT(jsonResponse);
            res.send(modifiedJSONResponse);
        } catch (error) {
            console.log(error);
        }
    })();
});

//returns detailed description of the article id passed in the query - guardian
app.get("/guardian-search",(req,res,next)=>{
    var articleID = req.query.id;
    var searchURL = guardianHomeURL +articleID+"?api-key=" + guardianAPIKey+"&show-blocks=all";
    console.log(searchURL);
    (async()=>{
        try{
            const response = await got(searchURL);
            var jsonResponse = JSON.parse(response.body);
            var modifiedJSONResponse = guardianSearchArticle(jsonResponse);
            res.send(modifiedJSONResponse);
        }
        catch(error){
            console.log(error);
        }
    })();

});


app.get("/guardian-detailed-article-android",(req,res,next)=>{
    var articleID = req.query.id;
    var searchURL = guardianHomeURL +articleID+"?api-key=" + guardianAPIKey+"&show-blocks=all";
    console.log(searchURL);
    (async()=>{
        try{
            const response = await got(searchURL);
            var jsonResponse = JSON.parse(response.body);
            var modifiedJSONResponse = guardianDetailedArticleAndroid(jsonResponse);
            res.send(modifiedJSONResponse);
        }
        catch(error){
            console.log(error);
        }
    })();

});

app.get("/nyt-search", (req,res,next)=>{
    var webURL = req.query.id;
    var searchURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:\""+webURL + "\"&api-key=" + nytAPIKey;
    console.log(searchURL);
    (async()=>{
        try
        {
            const response = await got(searchURL);
            var jsonResponse = JSON.parse(response.body);
            var modifiedJSONResponse = nytSearchResponse(jsonResponse);
            res.send(modifiedJSONResponse);
        }
        catch(error)
        {
            console.log(error)
        }
    })();
 
})

app.get("/guardian-search-keyword", (req,res,next)=>{
    var keywordToSearch = req.query.keyword;
    var searchURL = guardianHomeURL+"search?q="+keywordToSearch +"&api-key=" + guardianAPIKey+"&show-blocks=all";
    console.log(searchURL);
    (async()=>{
        try
        {
            var response = await got(searchURL);
            var jsonResponse = JSON.parse(response.body);
            var modifiedJSONResponse = guardianSearchByKeyword(jsonResponse);
            res.send(modifiedJSONResponse);
        }
        catch(error)
        {
            console.log(error);
        }
    })();
});


app.get("/nyt-search-keyword", (req,res,next)=>{
    var keywordToSearch = req.query.keyword;
    var searchURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q="+keywordToSearch +"&api-key=" + nytAPIKey;
    console.log(searchURL);
    (async()=>{
        try
        {
            var response = await got(searchURL);
            var jsonResponse = JSON.parse(response.body);
            var modifiedJSONResponse = nytSearchByKeyword(jsonResponse);
            res.send(modifiedJSONResponse);
            //res.send(jsonResponse)
        }
        catch(error)
        {
            console.log(error);
        }
    })();
});


function nytSearchByKeyword(jsonResponse){
    
    var totalArticles = jsonResponse.response.docs.length;
    var nytSearchByKeywordResult = {};
    var arrayOfArticles = [];
    for(var i=0; i<totalArticles;i++){
        try{
            var nytSearch={};
            nytSearch["title"] = jsonResponse.response.docs[i].headline.main;
    
            var longerDate = jsonResponse.response.docs[i].pub_date;
        
            nytSearch["date"] = longerDate.substring(0,10);
            nytSearch["id"]= jsonResponse.response.docs[i].web_url;
            nytSearch["section"] = jsonResponse.response.docs[i].section_name;
            nytSearch["source"] ="nytimes";
            nytSearch["urlToShare"] = jsonResponse.response.docs[i].web_url;
            try{
                var multimediaArray = jsonResponse.response.docs[i].multimedia;
                var found =0;
                for(var j=0;j<multimediaArray.length;j++)
                {
                    if(found == 1)
                    {
                        break;
                    }
                    else
                    {
                        var width = multimediaArray[j].width;
                        if(width>=2000)
                        {
                            nytSearch["image"] = "https://nyt.com/"+multimediaArray[j].url;
                            nytSearch["width"] = width;
                            found = 1;
                        }
                    }
                }
            
                    if(found == 0)
                    {
                        nytSearch["image"] = defaultNYTImage;
                    }
            }
            catch(exception){
                nytSearch["image"] = defaultNYTImage;
            }
            
                nytSearch["description"] = jsonResponse.response.docs[i].abstract;
                nytSearch["source"] = "nytimes";
                arrayOfArticles.push(nytSearch);
        }
        catch(exception)
        {
            continue;
        }
  
        }

    nytSearchByKeywordResult["articles"] = arrayOfArticles;
    return nytSearchByKeywordResult
}

function guardianSearchByKeyword(jsonResponse)
{
    var totalArticles = jsonResponse.response.results.length;
    var guardianHomePageResult = {};
    var arrayOfArticles = [];
    guardianHomePageResult["countOfArticles"] = totalArticles;
    for(var i=0;i<Math.min(totalArticles, 10);i++)
    {
        try{
            var currentArticleObject = {};
            currentArticleObject["id"]=jsonResponse.response.results[i].id;
            currentArticleObject["title"] = jsonResponse.response.results[i].webTitle;
            currentArticleObject["section"] = jsonResponse.response.results[i].sectionId;
            var longerDate = jsonResponse.response.results[i].webPublicationDate;
            currentArticleObject["date"] = longerDate.substring(0,10);
            currentArticleObject["completeDate"] = longerDate;
            currentArticleObject["source"]="guardian"
            currentArticleObject["description"] = jsonResponse.response.results[i].blocks.body[0].bodyTextSummary;
            console.log(i);
            try{
                console.log("In try");
                var lengthOfAssets = jsonResponse.response.results[i].blocks.main.elements[0].assets.length;
                if(lengthOfAssets>0)
                {
                    currentArticleObject["image"] = jsonResponse.response.results[i].blocks.main.elements[0].assets[lengthOfAssets-1].file;
                }
                else
                {
                    currentArticleObject["image"] = defaultGuardianImage;
                }
            }
            catch(exception){
                console.log("In catch")
                currentArticleObject["image"] = defaultGuardianImage;
            }
           
            currentArticleObject["urlToShare"] =  jsonResponse.response.results[i].webUrl;
            arrayOfArticles.push(currentArticleObject);
        }
        catch(exception){
            continue;
        }
      
    }

    guardianHomePageResult["articles"] = arrayOfArticles;
    return guardianHomePageResult;   
}

function nytSearchResponse(jsonResponse)
{
    var nytSearch = {};
    nytSearch["title"] = jsonResponse.response.docs[0].headline.main;

    var longerDate = jsonResponse.response.docs[0].pub_date;
    nytSearch["date"] = longerDate.substring(0,10);
    nytSearch["id"]= jsonResponse.response.docs[0].web_url;
    nytSearch["section"] = jsonResponse.response.docs[0].section_name;
    nytSearch["source"] ="nytimes";
    nytSearch["urlToShare"] = jsonResponse.response.docs[0].web_url;
    try{
        var multimediaArray = jsonResponse.response.docs[0].multimedia;
        var found =0;
        for(var i=0;i<multimediaArray.length;i++)
        {
            if(found == 1)
            {
                break;
            }
            else
            {
                var width = multimediaArray[i].width;
                if(width>=2000)
                {
                    nytSearch["image"] = "https://nyt.com/"+multimediaArray[i].url;
                    nytSearch["width"] = width;
                    found = 1;
                }
            }
        }
    
        if(found == 0)
        {
            nytSearch["image"] = defaultNYTImage;
        }
    }
    catch(exception){
        nytSearch["image"] = defaultNYTImage;

    }
    
    nytSearch["description"] = jsonResponse.response.docs[0].abstract;
    

    return nytSearch;
}


function guardianDetailedArticleAndroid(jsonResponse){
    var guardianSearch = {};
    guardianSearch["title"] = jsonResponse.response.content.webTitle;
    guardianSearch["id"] = jsonResponse.response.content.id;
    guardianSearch["section"] = jsonResponse.response.content.sectionId;
    guardianSearch["source"] = "guardian"
    try{
        var lengthOfAssets = jsonResponse.response.content.blocks.main.elements[0].assets.length;
        if(lengthOfAssets>0)
        {
            guardianSearch["image"] = jsonResponse.response.content.blocks.main.elements[0].assets[lengthOfAssets-1].file;
        }
        else
        {
            guardianSearch["image"] = defaultGuardianImage;
        }
    }
    catch(exception){
        guardianSearch["image"] = defaultGuardianImage;
    }

    
    var totalBodyBlocks = jsonResponse.response.content.blocks.body.length;
    guardianSearch["totalBlocks"] = totalBodyBlocks;
    var bodyHTML = "";
    for(var j =0;j<parseInt(totalBodyBlocks);j++){
        bodyHTML = bodyHTML + " " + jsonResponse.response.content.blocks.body[j].bodyHtml;
    }
    guardianSearch["bodyhtml"] = bodyHTML;
    var longerDate = jsonResponse.response.content.webPublicationDate;
    guardianSearch["completeDate"] = longerDate;
    guardianSearch["date"] = longerDate.substring(0,10);
    guardianSearch["source"] = "guardian";
    guardianSearch["urlToShare"] = jsonResponse.response.content.webUrl;
    guardianSearch["description"] = jsonResponse.response.content.blocks.body[0].bodyTextSummary;


    return guardianSearch;

}


function guardianSearchArticle(jsonResponse){
    var guardianSearch = {};
    guardianSearch["title"] = jsonResponse.response.content.webTitle;
    guardianSearch["id"] = jsonResponse.response.content.id;
    guardianSearch["section"] = jsonResponse.response.content.sectionId;
    guardianSearch["source"] = "guardian"
    try{
        var lengthOfAssets = jsonResponse.response.content.blocks.main.elements[0].assets.length;
        if(lengthOfAssets>0)
        {
            guardianSearch["image"] = jsonResponse.response.content.blocks.main.elements[0].assets[lengthOfAssets-1].file;
        }
        else
        {
            guardianSearch["image"] = defaultGuardianImage;
        }
    }
    catch(exception){
        guardianSearch["image"] = defaultGuardianImage;
    }

    var longerDate = jsonResponse.response.content.webPublicationDate;
    guardianSearch["date"] = longerDate.substring(0,10);
    guardianSearch["source"] = "guardian";
    guardianSearch["urlToShare"] = jsonResponse.response.content.webUrl;
    guardianSearch["description"] = jsonResponse.response.content.blocks.body[0].bodyTextSummary;


    return guardianSearch;

}


function sectionNYT(jsonResponse){
    var totalAvailableArticles = jsonResponse.num_results;
    var nytResult={};
    var arrayOfArticles = [];
    var count = 0;
    for(var i=0; i<totalAvailableArticles; i++)
    {
        if(count==10)
        {
            break;
        }
        try{
            var currentArticleObject = {};
            currentArticleObject["title"]=jsonResponse.results[i].title;
            currentArticleObject["id"] = jsonResponse.results[i].url;
            currentArticleObject["source"] = "nytimes";
            try{
                var imageArray = jsonResponse.results[i].multimedia;
                var found = 0;
                for(var j = 0; j<imageArray.length; j++){
                    if(found == 1){
                        break;
                    }
                    else
                    {
                        if(imageArray[j].width >= 2000)
                        {
                            currentArticleObject["image"]= imageArray[j].url;
                            currentArticleObject["image-width"] = imageArray[j].width;
                            found = 1;
                        }
                    }
                }
        
                if(found == 0)
                {
                    currentArticleObject["image"] = defaultNYTImage;
                }
                count++;
            }
            catch(exception){
                currentArticleObject["image"] = defaultNYTImage;
    
            }
            currentArticleObject["section"]=jsonResponse.results[i].section;
            var fullDate = jsonResponse.results[i].published_date;
            currentArticleObject["date"]= fullDate.substring(0,10);
            currentArticleObject["description"]=jsonResponse.results[i].abstract;
            currentArticleObject["urlToShare"]=jsonResponse.results[i].url;
            arrayOfArticles.push(currentArticleObject);
        }
        catch(exception){
            continue;
        }
      
    }
    nytResult["articles"] = arrayOfArticles;
    return nytResult;

}


function homeNYT(jsonResponse){
    var totalAvailableArticles = jsonResponse.num_results;
    var nytResult={};
    var arrayOfArticles = [];
    for(var i=0; i<totalAvailableArticles; i++)
    {
        try{
            var currentArticleObject = {};
            currentArticleObject["title"]=jsonResponse.results[i].title;
            currentArticleObject["id"] = jsonResponse.results[i].url;
            currentArticleObject["source"] = "nytimes";
            try{
                var imageArray = jsonResponse.results[i].multimedia;
                var found = 0;
                for(var j = 0; j<imageArray.length; j++){
                    if(found == 1){
                        break;
                    }
                    else
                    {
                        if(imageArray[j].width >= 2000)
                        {
                            currentArticleObject["image"]= imageArray[j].url;
                            currentArticleObject["image-width"] = imageArray[j].width;
                            found = 1;
                        }
                    }
                }
        
                if(found == 0)
                {
                    currentArticleObject["image"] = defaultNYTImage;
                }
        
            }
            catch(exception){
                currentArticleObject["image"] = defaultNYTImage;
    
            }
            currentArticleObject["section"]=jsonResponse.results[i].section;
            var fullDate = jsonResponse.results[i].published_date;
            currentArticleObject["date"]= fullDate.substring(0,10);
            currentArticleObject["description"]=jsonResponse.results[i].abstract;
            currentArticleObject["urlToShare"]=jsonResponse.results[i].url;
            arrayOfArticles.push(currentArticleObject);
        }
        catch(exception){
            continue;
        }
      
    }
    nytResult["articles"] = arrayOfArticles;
    return nytResult;

}

function androidGuardian(jsonResponse){
    var totalArticles  = jsonResponse.response.results.length;
    var guardianAndroidResult = {};
    var arrayOfArticles = [];
    for(var i=0; i<Math.min(totalArticles, 10); i++){
        try{
            var currentArticleObject = {};
            currentArticleObject["id"] = jsonResponse.response.results[i].id;
            try{
                var k = jsonResponse.response.results[i].fields.thumbnail;
                if(k!=null)
                    currentArticleObject["thumbnail"] = k;
                else
                    currentArticleObject["thumbnail"] = defaultGuardianImage;       
                console.log("in try");
                console.log("k is " + k);
            }
            catch(exception){
                currentArticleObject["thumbnail"] = defaultGuardianImage;
                console.log("in catch");
            }
            currentArticleObject["section"] = jsonResponse.response.results[i].sectionName;
            currentArticleObject["urlToShare"] = jsonResponse.response.results[i].webUrl;
            currentArticleObject["date"] = jsonResponse.response.results[i].webPublicationDate;
            currentArticleObject["title"] = jsonResponse.response.results[i].webTitle;
            arrayOfArticles.push(currentArticleObject);

        }
        catch(exception){
            continue;
        }
    }

    guardianAndroidResult["articles"] = arrayOfArticles;
    return guardianAndroidResult;
}

function homePageGuardian(jsonResponse)
{

    var totalArticles = jsonResponse.response.results.length;
    var guardianHomePageResult = {};
    var arrayOfArticles = [];
    for(var i=0;i<totalArticles;i++)
    {
        try{
            var currentArticleObject = {};
            currentArticleObject["id"]=jsonResponse.response.results[i].id;
            currentArticleObject["title"] = jsonResponse.response.results[i].webTitle;
            currentArticleObject["section"] = jsonResponse.response.results[i].sectionId;
            var longerDate = jsonResponse.response.results[i].webPublicationDate;
            currentArticleObject["date"] = longerDate.substring(0,10);
            currentArticleObject["completeDate"] = longerDate;
            currentArticleObject["description"] = jsonResponse.response.results[i].blocks.body[0].bodyTextSummary;
            try{
                var lengthOfAssets = jsonResponse.response.results[i].blocks.main.elements[0].assets.length;
                if(lengthOfAssets>0)
                {
                    currentArticleObject["image"] = jsonResponse.response.results[i].blocks.main.elements[0].assets[lengthOfAssets-1].file;
                }
                else
                {
                    currentArticleObject["image"] = defaultGuardianImage;
                }
            }
            catch(exception){
                currentArticleObject["image"] = defaultGuardianImage;
            }
    
            currentArticleObject["source"] = "guardian";
            currentArticleObject["urlToShare"] =  jsonResponse.response.results[i].webUrl;
            arrayOfArticles.push(currentArticleObject);
        }
        catch(exception){
            continue;
        }
     
    }

    guardianHomePageResult["articles"] = arrayOfArticles;
    return guardianHomePageResult;
}

function sectionGuardian(jsonResponse)
{

    var totalArticles = jsonResponse.response.results.length;
    var guardianHomePageResult = {};
    var arrayOfArticles = [];
    var count = 0;
    for(var i=0;i<totalArticles;i++)
    {
        if(count == 10)
        {
            break;
        }
        try{
            var currentArticleObject = {};
            currentArticleObject["id"]=jsonResponse.response.results[i].id;
            currentArticleObject["title"] = jsonResponse.response.results[i].webTitle;
            currentArticleObject["section"] = jsonResponse.response.results[i].sectionId;
            var longerDate = jsonResponse.response.results[i].webPublicationDate;
            currentArticleObject["date"] = longerDate.substring(0,10);
            currentArticleObject["completeDate"] = longerDate;
            currentArticleObject["description"] = jsonResponse.response.results[i].blocks.body[0].bodyTextSummary;
            try{
                var lengthOfAssets = jsonResponse.response.results[i].blocks.main.elements[0].assets.length;
                if(lengthOfAssets>0)
                {
                    currentArticleObject["image"] = jsonResponse.response.results[i].blocks.main.elements[0].assets[lengthOfAssets-1].file;
                }
                else
                {
                    currentArticleObject["image"] = defaultGuardianImage;
                }
            }
            catch(exception){
                currentArticleObject["image"] = defaultGuardianImage;
            }
    
            currentArticleObject["source"] = "guardian";
            currentArticleObject["urlToShare"] =  jsonResponse.response.results[i].webUrl;
            arrayOfArticles.push(currentArticleObject);
            count++;
        }
        catch(exception){
            continue;
        }
     
    }
    guardianHomePageResult["articles"] = arrayOfArticles;
    return guardianHomePageResult;
}

