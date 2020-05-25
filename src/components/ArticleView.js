import React from "react"
import queryString from 'query-string';
import {Card, CardGroup} from "react-bootstrap";
import ReactToolTip from "react-tooltip";
import {EmailShareButton, TwitterShareButton, FacebookShareButton} from "react-share"
import {FacebookIcon, TwitterIcon, EmailIcon} from "react-share"
import TruncateDes from './TruncateDes';
import {MdExpandLess, MdExpandMore} from "react-icons/md";
import Loading from "./Loading"
import {FaRegBookmark, FaBookmark} from "react-icons/fa"
import { ToastContainer, toast,Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {withRouter} from 'react-router-dom';
import Comments from './Comments'
import {animateScroll as scroll, scroller, Element} from 'react-scroll';


class ArticleView extends React.Component{

    constructor(){
        super()
        this.state = {
          articlesArray:{},
          updated:false,
          type:true,
          expand:false,
          bookmarked:false,
          idOfArticle:'',
          showArrow:true

        }
        this.toggleExpandCollapse = this.toggleExpandCollapse.bind(this);
        this.toggleBookmarks = this.toggleBookmarks.bind(this);
        this.removeExpandCollapseButton = this.removeExpandCollapseButton.bind(this);
        this.myRef = React.createRef();
        this.scrollMore = this.scrollMore.bind(this);
        this.scrollUp = this.scrollUp.bind(this);
      }

      removeExpandCollapseButton(){
          this.setState({
              showExpandCollapseButton:false
          })
      }


      scrollMore(){
          //console.log("Scroll more");
          scroller.scrollTo("element-scroll", {smooth:true});
      }

      scrollUp(){
        // window.scrollTo({top:0, left: 0,behaviour:'smooth'}); 
       scroll.scrollToTop({behaviour:'smooth'});
      }

      toggleBookmarks(){
          console.log("In toggle bookmarks");
          var toastText;
        if(this.state.bookmarked)
        {
            //remove bookmark from local storage
            localStorage.removeItem(this.state.articlesArray.id)
            //change state of bookmarked
            this.setState({
                bookmarked:false
            })
            toastText = "Removing "+ this.state.articlesArray.title

            toast(toastText,{
                bodyClassName: "toastBody",
                position:toast.POSITION.TOP_CENTER,
                hideProgressBar:true,
                pauseOnHover:false,
                transition: Zoom,
                autoClose: 3000
            });      
         }

        else
        {
            localStorage.setItem(this.state.articlesArray.id, this.state.articlesArray.source);

            this.setState({
              bookmarked:true
            })
            toastText = "Saving "+ this.state.articlesArray.title


            toast(toastText,{
                bodyClassName: "toastBody",
                position:toast.POSITION.TOP_CENTER,
                hideProgressBar:true,
                pauseOnHover:false,
                transition: Zoom,
                autoClose: 3000
            });  
    
        }
      }

      toggleExpandCollapse(){

        var ref = this.myRef;
        if(!this.state.expand)
        {
            this.scrollMore(ref);
            this.setState(
                {
                    articlesArray: this.state.articlesArray,
                    updated: this.state.updated,
                    type:this.state.type,
                    expand: true
                }
            )
        }
        else
        {
            this.scrollUp();
            setTimeout(()=>{
                this.setState(
                        {
                        articlesArray: this.state.articlesArray,
                        updated: this.state.updated,
                        type:this.state.type,
                        expand: false
                    }
                )
            }, 1000)
  
        }
        
      }
    

    componentDidMount(){
        if(this.props.keyword!=""){
            this.props.updateSearchQuery("");
        }
        if(this.props.showToggle)
        {
            this.props.changeToggleState();
        }

        if(this.props.bookmarkFilled)
        {
          this.props.changeBookmarkState();
        }

        var currentLocation = window.location.search;
        let objectArticle = queryString.parse(currentLocation);  
        let idOfArticle = objectArticle.id;
        var url;
        if(idOfArticle){
            url = "https://nodejs-backend-273405.appspot.com/guardian-search?id=" + idOfArticle;
            this.setState({
                idOfArticle:idOfArticle
            })
        }
        else{
            this.setState({
                idOfArticle: objectArticle.webURL
            })
            url = "https://nodejs-backend-273405.appspot.com/nyt-search?id=" + objectArticle.webURL;
        }

        fetch(url)
            .then(response => response.json())
            .then((data) => 
            {
                var desc = data.description.split(".");
                var temp = 0;
                for(var i=0;i<desc.length;i++)
                {
                    if(temp>4)
                    {
                        break;
                    }
                    if(desc[i]!="")
                    temp = temp+1;
                }
                var showArrow;
                if(temp>4)
                showArrow = true;
                else
                showArrow=false
                this.setState({
                    showArrow:showArrow,
                    articlesArray:data,
                    updated:true,
                })}
            )  
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if(key === idOfArticle)
                {
                    this.setState({
                        bookmarked:true
                    })
                    break;
                }              
            } 
            
            
    }

    componentDidUpdate(){
        ReactToolTip.rebuild();
    }

    render(){
        var bookMarkButton;
        if(this.state.bookmarked)
        {
            bookMarkButton = <FaBookmark className="float-right mr-1" size = {"1.5em"} onClick={this.toggleBookmarks}  color={"#ED0034"} data-tip="Bookmark"/>
        }
        else
        {
            bookMarkButton = <FaRegBookmark className="float-right mr-1" size = {"1.5em"} onClick={this.toggleBookmarks} color={"#ED0034"}  data-tip="Bookmark"/>

        }
        var textDescription;

        var expandCollapseButton;
        if(this.state.expand)
        {
            textDescription=<TruncateDes 
                myRef = {this.myRef}
                desc ={this.state.articlesArray.description}
                type="expandedCard" />
                if(this.state.showArrow)
                {
                    expandCollapseButton = <MdExpandLess />
                }

        }
        else
        {
            textDescription=<TruncateDes 
            myRef = {this.myRef}
                desc = {this.state.articlesArray.description} 
                type="collapsedCard"/>
                if(this.state.showArrow)
                {
                    expandCollapseButton = <MdExpandMore/>
                }
        }

        if(!this.state.updated)
        {
            return(
                <Loading/>
            );
        }
        else
        {   
            var urlToShareForEmail =  this.state.articlesArray.urlToShare;
            return(
                <div>
                <CardGroup>
                {/* <div className="row justify-content-center"> */}
                    <ReactToolTip effect="solid"/>
                    <Card className="m-4 shadow">
                    <Card.Body>
                        <Card.Title className = "detailedArticleViewTitle">{this.state.articlesArray.title}</Card.Title>
                        <div className ="detailedArticleViewRowTwo row">
                            <div className="col-5 col-lg-7 d-inline pr-0">
                                <p className="font-italic">{this.state.articlesArray.date}</p>
                            </div>
                            <div className="col-5 col-lg-4 text-right d-inline pl-0 pr-0">
                                <FacebookShareButton 
                                            url= {this.state.articlesArray.urlToShare}
                                            hashtag ="#CSCI_571_NewsApp"
                                        >
                                        <FacebookIcon className="align-middle" data-tip="Facebook" size={32} round={true}/>
                                        </FacebookShareButton>
        
                                <TwitterShareButton
                                    url= {this.state.articlesArray.urlToShare}
                                    hashtags={["CSCI_571_NewsApp"]}
                                >
                                <TwitterIcon data-tip="Twitter" round={true} size={32}/>
                                </TwitterShareButton>

                                <EmailShareButton
                                    subject="#CSCI_571_NewsApp"
                                    url = {urlToShareForEmail}
                                >
                                <EmailIcon data-tip="Email" round={true} size={32}/>
                                </EmailShareButton>
                                </div> 
                                <div  className="col-2 col-lg-1 mt-1 float-right">
                                {bookMarkButton}
                                </div>  
                                <ToastContainer />
                         
                        </div>
                        <Card.Img variant="top" src={this.state.articlesArray.image} />
                        <Card.Text className="text-justify">
                            {textDescription}
                        </Card.Text>
                        <div className = "expandMore" onClick={this.toggleExpandCollapse}>
                            {expandCollapseButton}
                        </div>
                    </Card.Body>
                </Card>
                </CardGroup>
            {/* </div> */}
                            <Comments commentBoxId={this.state.idOfArticle} />
</div>
            )
        }       
    }
}

export default withRouter(ArticleView)