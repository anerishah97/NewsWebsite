import React from "react"
import BounceLoader from "react-spinners/BounceLoader";


class Loading extends React.Component{
    render(){
        return(
            <div className="theEntireLoadingClass">
            <div className="loadingClass" >
                <BounceLoader
                    color={"#264178"}
                    size={40}
                />
            </div>

                <p className="text-center">Loading</p>
                </div>
        )
    }
}

export default Loading;