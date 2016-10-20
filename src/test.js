import React from 'react'
import Fetch from './base/fetch.js'

export default class AppTest extends React.Component{

  render(){
    return (
      <Fetch url="http://localhost:3300/Menu/Menu/0">
        <TestComponent/>
      </Fetch>
    )
  }

}

class TestComponent extends React.Component{
  render(){
    return <div/>
  }
}
