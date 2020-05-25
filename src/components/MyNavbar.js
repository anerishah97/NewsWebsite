import React from "react"
import {Navbar, Nav} from "react-bootstrap"
import Switch from "react-switch"
import {FaRegBookmark, FaBookmark} from "react-icons/fa"
import { Link } from 'react-router-dom'
import _ from "lodash";
import Select from "react-select";
import {Redirect} from "react-router-dom"
import {withRouter} from 'react-router-dom';
import ReactToolTip from "react-tooltip";

class MyNavbar extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      checked :false,
      redirect:false,
      queryValue:'',
      selectedOption: '',
      isLoading:false,
      defaultval: this.props.keyword,
      currentSelectedNavLink:1
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOptionSelect = this.handleOptionSelect.bind(this);
    this.setRedirectToFalse = this.setRedirectToFalse.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
    this.resetKeyword = this.resetKeyword.bind(this);
    this.updateSelectedNavLink = this.updateSelectedNavLink.bind(this);
    this.currentSelectedNavLink = this.currentSelectedNavLink.bind(this);
  }
  componentDidUpdate(){
    ReactToolTip.rebuild();
  } 

  resetKeyword(){
    this.props.updateSearchQuery("");
  }

  static getDerivedStateFromProps(props,state){
    if(props.keyword !== state.defaultval){
      return {
        defaultval: props.keyword
      }
    }

    return null;
  }



  componentDidMount(){
    if(localStorage.getItem("source")){
      var currentSource = localStorage.getItem("source");
      if(currentSource=="nyt")
      {
        this.props.handleChange(false);
      }
      else
      {
        this.props.handleChange(true);
      }
    }
    else{
      localStorage.setItem("source","guardian");
    }

    //this.updateOptions();
  }


  setRedirectToFalse(){
    this.setState({
      redirect:false
    })
  }

  currentSelectedNavLink(param){
    if(this.state.currentSelectedNavLink!=param){
      this.setState ({
        currentSelectedNavLink:param
      })
    }
  }

  updateSelectedNavLink(){
    var currentPathName = window.location.pathname;
    //console.log("heyyyyyyy");
    //console.log(currentPathName);
    if(currentPathName == "/" || currentPathName == "home"){
      if(this.state.currentSelectedNavLink!=1){
        this.setState({
          currentSelectedNavLink: 1
        })
      }
    }
    else if(currentPathName == "/world"){
      if(this.state.currentSelectedNavLink!=2){
        this.setState({
          currentSelectedNavLink :2
        })
      }
    }
    else if(currentPathName == "/politics"){
      if(this.state.currentSelectedNavLink!=3){
        this.setState({
          currentSelectedNavLink:3
        })
      }
    }
    else if(currentPathName == "/business"){
      if(this.state.currentSelectedNavLink!=4){
        this.setState({
          currentSelectedNavLink :4
        })
      }
    }
    else if(currentPathName == "/technology"){
      if(this.state.currentSelectedNavLink!=5){
        this.setState({
          currentSelectedNavLink : 5
        })
      }
    }

    else if(currentPathName == "/sports"){
      if(this.state.currentSelectedNavLink!=6){
        this.setState({
          currentSelectedNavLink :6
        })
      }
    }
    else if(currentPathName == "/article" ||currentPathName=="/favourites" || currentPathName=="/search"){
      if(this.state.currentSelectedNavLink!=0){
        this.setState(
          {
            currentSelectedNavLink :0
          }
        )
      }
    }
  }

  handleChange(checked){
    this.setState({ checked });
    }

    async updateOptions(){
      this.setState({
        isLoading:true
      })
      var value = this.state.queryValue;
      if(value !="")
    {
      try{
      await fetch(
          `https://api.cognitive.microsoft.com/bing/v7.0/suggestions?mkt=en-US&q=${value}`,
          {
            headers: {
              "Ocp-Apim-Subscription-Key": process.env.REACT_APP_AUTOSUGGEST_KEY
            }
          }
        ).then(response=>response.json())
        .then(
            (data)=>{
              const resultsRaw = data.suggestionGroups[0].searchSuggestions;
              const results = resultsRaw.map(result => ({ value: result.displayText, label: result.displayText }));
              this.setState({
                  options:results
                  
               });
              } 
        );
      }
      catch(error){
        console.error("There's an error " + error);
      }
    }
    else{
      this.setState({
        options:[]
      })
    }
      this.setState({
        isLoading:false
      })
  }


  handleInputChange(newValue){
      this.setState({
          queryValue:newValue
      })
      this.updateOptions();
  }

  handleOptionSelect(finalValue)
  {
    console.log("Changinf update search query");
    this.props.updateSearchQuery(finalValue.value);
    this.setState({
      queryValue:finalValue.value,
      redirect:true
    })
  }
  render(){
      const spanMargins = {
        marginLeft:"4px",
        marginRight:"4px"
    }

    this.updateSelectedNavLink();
  var expandURL="/search?keyword=" + this.state.queryValue
  if(this.state.redirect){
    this.setRedirectToFalse();
    //console.log("inside redirect");
   // console.log(" and the query valye is " + this.props.keyword);
    return(
      <Redirect push to={expandURL}/>
    )
  }
  var selectReact="";
  if(this.props.showToggle){
    selectReact = 
    <Nav>
    <Navbar.Brand>NYTimes</Navbar.Brand>
    <Navbar.Brand>
    <Switch 
      onChange={this.props.handleChange}
      checked={this.props.checked}
      checkedIcon={false}
      uncheckedIcon={false}
      onColor="#028EFA"
      /></Navbar.Brand>

    <Navbar.Brand>Guardian</Navbar.Brand>
    </Nav>
  }
    var j = this.state.defaultval;
    return(
      <Navbar variant="dark" bg="dark" expand="lg" id="gradient-color" >
        <div className="col-lg-3 paddingLeftToZero">
      <Select  
                        placeholder="Enter keyword..."
                        key = {this.state.defaultval}
                        onInputChange = {_.debounce(this.handleInputChange, 700, {})}
                        onChange = {this.handleOptionSelect}
                        id="searchSelect"
                        options={this.state.options}
                        isLoading = {this.state.isLoading}
                        defaultInputValue = {this.state.defaultval}
                        //key={this.state.queryValue}
                    />
          
      <Navbar.Toggle aria-controls="responsive-navbar-nav" className="float-right"/>
      </div>
      <Navbar.Collapse id="responsive-navbar-nav">            
        <Nav className="mr-auto" activeKey={this.state.currentSelectedNavLink} onSelect = {this.currentSelectedNavLink}>
          <Nav.Link as={Link} to="/" href="/"  onClick={this.resetKeyword} eventKey={1}>Home</Nav.Link>
          <Nav.Link as={Link} to="/world" href="/world" onClick={this.resetKeyword} eventKey={2}>World</Nav.Link>
          <Nav.Link as={Link} to="/politics" href="/politics"  onClick={this.resetKeyword} eventKey={3}>Politics</Nav.Link>
          <Nav.Link as={Link} to="/business" href="/business"  onClick={this.resetKeyword} eventKey={4}>Business</Nav.Link>
          <Nav.Link as={Link} to="/technology" href="/technology" onClick={this.resetKeyword} eventKey={5}>Technology</Nav.Link>
          <Nav.Link as={Link} to="/sports" href="/sports"  onClick={this.resetKeyword} eventKey={6}>Sports</Nav.Link>
          
        </Nav>

        <ReactToolTip id="bookmark-tooltip" place = "bottom" effect="solid"/>
        <Nav.Link as={Link} to="/favourites" href="/favourites" onClick={this.resetKeyword}>
        {this.props.bookmarkFilled? <FaBookmark color={"fff"} data-tip="Bookmark" data-for="bookmark-tooltip"/>: <FaRegBookmark data-tip="Bookmark" data-for="bookmark-tooltip"/>}  
        </Nav.Link>

        {selectReact}

      </Navbar.Collapse>
      </Navbar>
      ) 
  }

}

export default withRouter(MyNavbar);