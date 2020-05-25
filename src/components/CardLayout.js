import React from "react"
import NewsCard from "./NewsCard"
import '../styles.css'

class CardLayout extends React.Component{

    constructor(){
        super();
        this.state = {
            isloaded:false
        }
    }

    render(){

        const articleArray = this.props.articleArray.articles;
        var allArticles = []
        for(var i=0; i<articleArray.length;i++)
        {
            allArticles.push(<NewsCard 
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

        return( 
            <div >
                {allArticles}
            </div>    
        )
    }
   

}


export default CardLayout;