import React from "react"
import {withRouter} from 'react-router-dom';
import queryString from 'query-string';
import SearchCard from './SearchCard';
import { CardDeck, CardGroup } from "react-bootstrap";
class Search extends React.Component{
    constructor(){
        super();
        this.state = {
            articleArray:{},
            updated:false,
            type:true,
            keyword:'',
            nytUpdated: false,
            countOfArticles:false
          }
          this.searchFromNYT = this.searchFromNYT.bind(this);
    }

    searchFromNYT(){
        var url =  "https://nodejs-backend-273405.appspot.com/nyt-search-keyword?keyword=" + this.state.keyword;
       // console.log("NYT " + url);
        fetch(url)
        .then(response => response.json())
        .then((data) => 
        this.setState({
            articleArrayNYT:data,
            nytUpdated:true,
            keyword:""
            })
        ) 

    }


    componentDidMount(){
        
        if(this.props.bookmarkFilled)
        {
          this.props.changeBookmarkState();
        }

        if(this.props.showToggle)
        {
            this.props.changeToggleState();

        }
        var currentLocation = window.location.search;
        let objectArticle = queryString.parse(currentLocation);  
        let keyword = objectArticle.keyword;
    
   if(this.props.keyword!= keyword)
        {
            this.props.updateSearchQuery(keyword);
        }
        //console.log(keyword);
        var url = "https://nodejs-backend-273405.appspot.com/guardian-search-keyword?keyword=" + keyword;
       // console.log(url);
        fetch(url)
        .then(response => response.json())
        .then((data) => 
        this.setState({
            articleArray:data,
            updated:true,
            keyword:keyword,
            totalCount: data["countOfArticles"],
            countFromGuardian:data["articles"].length
            })
        )  
     
    }
    
    componentWillUnmount(){
        //console.log("In component did unmount")

    }

    render(){        
        var allArticles = []
        var currentLocation = window.location.search;
        let objectArticle = queryString.parse(currentLocation);  
        let keyword = objectArticle.keyword;
    
        if(this.state.updated){

            var articleArray = this.state.articleArray.articles;
            if(articleArray.length<10)
            {
                this.searchFromNYT();
            }
            allArticles = []
            for(var i=0; i<articleArray.length;i++)
            {
                if(!this.state.countOfArticles)
                {
                    this.setState({
                        countOfArticles:true
                    })
                }
               
                allArticles.push(<SearchCard 
                    title={articleArray[i].title}
                    section={articleArray[i].section}
                    description={articleArray[i].description}
                    key={articleArray[i].id}
                    date = {articleArray[i].date}
                    image = {articleArray[i].image}
                    urlToShare= {articleArray[i].urlToShare}  
                    id={articleArray[i].id}   
                    source={articleArray[i].source}            
                    />)
            }

            // if(this.state.calledNYT)
            {
                if(this.state.nytUpdated)
                {
                    var articleArray = this.state.articleArrayNYT.articles;
                    var lengthOfGuardian = this.state.articleArray.articles.length;
                    var differenceGuardianNYT = 10-lengthOfGuardian;
                    for(var i=0; i<Math.min(differenceGuardianNYT, articleArray.length);i++)
                    {
                        allArticles.push(<SearchCard 
                            reset = {this.props.updateSearchQuery}
                            title={articleArray[i].title}
                            section={articleArray[i].section}
                            description={articleArray[i].description}
                            key={articleArray[i].id}
                            date = {articleArray[i].date}
                            image = {articleArray[i].image}
                            urlToShare= {articleArray[i].urlToShare}  
                            id={articleArray[i].id}   
                            source={articleArray[i].source}            
                            />)
                    }
        
                }
           
            }

    }
    var countOfArticles = allArticles.length;
   // console.log("number of articles");
  //  console.log(countOfArticles);

    var text = "";
    if(this.state.updated){
        if(this.state.countOfArticles){
            text = 
            <h3 className="ml-3">Results</h3>
        }
        else{
            text =
            <h3 class="text-center"> No Results Found</h3>
        }
    }
        return(
            <div>
            {text}
            <CardGroup>
                {allArticles}
            </CardGroup>
            </div>
            )
    }
}

export default withRouter(Search)