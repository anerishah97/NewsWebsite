import React from "react"
import {Card,Modal} from "react-bootstrap"
import '../styles.css'
import {IoMdShare} from "react-icons/io";
import {MdDelete} from "react-icons/md";
import {EmailShareButton, TwitterShareButton, FacebookShareButton} from "react-share"
import {FacebookIcon, TwitterIcon, EmailIcon} from "react-share"
import {toast, Zoom } from 'react-toastify';
import Truncate from 'react-truncate';

import { Redirect } from "react-router-dom";
class FavouriteCard extends React.Component{
    constructor(){
        super();
        this.state = {
            "show":false,
            "redirect":false,
            "removedBookmark":false
        }
        this.handleClose = this.handleClose.bind(this);
        this.openArticle = this.openArticle.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.deleteFromBookmarks = this.deleteFromBookmarks.bind(this);
    }

    deleteFromBookmarks(event){
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        var toastText = "Removing "+this.props.title;
        toast(toastText,{
            bodyClassName: "toastBody",
            position:toast.POSITION.TOP_CENTER,
            hideProgressBar:true,
            pauseOnHover:false,
            transition: Zoom,
            autoClose: 3000
        });  
        var id = this.props.id;
        localStorage.removeItem(id);
        this.setState({
                removedBookmark:true
            })
    }

    handleShow(event){
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        this.setState({
            "show": true,
            "redirect":this.state.redirect
        })
    }

    handleClose(event){
        this.setState({
            "show": false,
            "redirect":this.state.redirect
        })
    }
   
    openArticle(event){
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        console.log("In openarticle");
        console.log(this.props.title)
        this.setState({
            "show":this.state.show,
            "redirect":true
        })
    }

    render(){
        var colors = {
            "business":"#0190FF",
            "technology":"#C0DA04",
            "sport":"#FFB600",
            "politics":"#0B8878",
            "world":"#7444E6",
            "other":"#5E6A6E",
            "nytFav":"#D8D8D8",
            "guardianFav":"#2A364A"
        }

        var textColors = {
            "business":"#fff",
            "technology":"#000",
            "sport":"#000",
            "politics":"#fff",
            "world":"#fff",
            "other":"#fff",
            "nytFav":"#000",
            "guardianFav":"#fff"
        }

        var sectionBackgroundStyle = {
            marginLeft:"4px",
            backgroundColor:colors.other,
            color:textColors.other
        }

        var currentSection = this.props.section;
        if(currentSection in colors)
        {
            var c = colors[currentSection]
            var textC = textColors[currentSection]
            sectionBackgroundStyle = {
                backgroundColor:c,
                color: textC,
                marginLeft:"4px"
            }
        }

        var sourceBackgroundStyle = {
            backgroundColor: colors.guardianFav,
            color: textColors.guardianFav
        }

        if(this.props.source === "nytimes")
        {
            sourceBackgroundStyle = {
                backgroundColor: colors.nytFav,
                color: textColors.nytFav
            }
        }
        var expandURL;
        if(this.props.source === "nytimes"){
            expandURL = "/article?webURL="+this.props.id;
        }
        else{
            expandURL = "/article?id="+this.props.id;
        }

        if(this.state.redirect){
            return(<Redirect push to={expandURL} />)
        }

        if(this.state.removedBookmark){

            return(<Redirect push to={"/favourites"}/>)
        }
        var textDesc = this.props.title;

        return(
            <div className="col-md-3 col-sm-12 mb-3">

            <Card className = "shadow"  onClick={this.openArticle}>
                <div>
                
                <Card.Body>
                <Card.Title className="font-italic" >
        <Truncate  lines={2}>  {this.props.title}</Truncate>
                        <IoMdShare id="shareButtonId"
                            onClick = {this.handleShow}
                         />  
                           <MdDelete id="deleteButtonId"
                            onClick = {this.deleteFromBookmarks}
                         />  
                      
                    </Card.Title>  
                    <Card.Img className="img-thumbnail p-1" variant="top" src={this.props.image}>
                </Card.Img>           
                    <div className="d-flex ml-1">
                        <Card.Text className="font-italic mr-auto p-2">{this.props.date}</Card.Text>   
                        <Card.Text className="p-2"><span style = {sectionBackgroundStyle} className ="badge text-uppercase">{this.props.section}</span></Card.Text>

                        <Card.Text className="p-2"><span style = {sourceBackgroundStyle} className ="badge text-uppercase">{this.props.source}</span></Card.Text>
                     
                    </div>
                </Card.Body>
                </div>
                <div onClick={event => event.stopPropagation()}>

                <Modal show={this.state.show} onHide={this.handleClose} >
                        <Modal.Header closeButton>
                        {/* <div className="row"> */}
                        <Modal.Title >
                            <h3 className="text-uppercase">{this.props.source}</h3>
                            <h5> 
                         {this.props.title}   </h5>
                        </Modal.Title>
                        {/* </div> */}
                        </Modal.Header>
                        <Modal.Body>
                          <h5 className="text-center">Share via</h5>
                            <div className = "shareButtonRow">
                                <FacebookShareButton 
                                    url= {this.props.urlToShare}
                                    hashtag ="#CSCI_571_NewsApp"
                                >
                                <FacebookIcon round={true}/>
                                </FacebookShareButton>

                                <TwitterShareButton
                                    url = {this.props.urlToShare}
                                 
                                    hashtags={["CSCI_571_NewsApp"]}
                                >
                                <TwitterIcon round={true}/>
                                </TwitterShareButton>

                                <EmailShareButton
                                    subject="#CSCI_571_NewsApp"
                                    url={this.props.urlToShare}
                                >
                                <EmailIcon round={true}/>
                                </EmailShareButton>

                            </div>
                        </Modal.Body>
                    </Modal>
                    </div>
            </Card>
            </div>
        )
    }

}

export default FavouriteCard;