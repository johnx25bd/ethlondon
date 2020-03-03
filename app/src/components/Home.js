import React,{Component} from 'react';

export default class Home extends Component {
    render() {
        return(
          <div className="row">
            <div className="col-1"></div>
              <div className="home-content col-10 text-center">
                <h1 id='main-logo' className='display-1'><span>🌐</span>g e o l o c k e r</h1>
                    <p>A spatial data registry <br />on <a href="https://ethereum.org/" target="_blank">Ethereum</a> and <a href="https://3box.io/" target="_blank">3Box</a></p>
              </div>
            <div className="col-1"></div>

          </div>
        )
    }
};
