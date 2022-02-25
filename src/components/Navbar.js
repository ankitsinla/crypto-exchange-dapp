import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Navbar extends Component {

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            EthSwap
          </a>

          <ul className='navbar-nav px-3'>
              <li className=''>
                  <small>{this.props.account}</small>
                  {this.props.account
              ? <img className='ml-2' width='30' height = '30' 
              src={`data:image/png;base64,${new Identicon(this.props.account,30).toString()}`}alt="" />
              : <span></span>}
              </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Navbar;
