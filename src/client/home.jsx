import React, { Component } from 'react';
import format from 'date-fns/format';
import Materialize from 'materialize-css';


const Loading = () => (
  <div style={{
    position: 'fixed',
    bottom: '10px',
    left: '10%',
    width: '80%',
  }} className="progress indigo darken-3">
    <div className="indeterminate indigo lighten-5"></div>
  </div>
);

const renderPage = ({ drafts, numEntries, numDrafts }) => {
  const info = <h1>{`${numEntries} entries loaded, ${numDrafts} are draft or updated.`}</h1>;
  const humanDrafts = drafts.map(draft => {
    const humanDate = format(new Date(draft.updated), 'dddd Do MMMM YYYY');
    return (
    <li className='collection-item'>
      <span className='title'>{draft.title}</span>
      <p>
        {`Content Type: ${draft.contentType}`}
        <br />
        {`Last Updated: ${humanDate}`}
      </p>
    </li>
  )
  });
  return (
    <div className='entries'>
      {info}
      <h2>Sorted by most recently updated</h2>
      <ul className='collection'>{humanDrafts}</ul>
    </div>
  )
}

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drafts: <h1>Loading</h1>,
      numEntries: 0,
      numDrafts: 0,
    }
    this.loaded = false;
  }

  async componentWillMount() {
    const blob = await fetch('/api/contentful/drafts');
    const json = await blob.json();
    console.log(json);
    this.loaded = true;
    Materialize.toast('Page Updated', 4000)
    this.setState(json);
  }

  render() {
    if (this.loaded) {
      return renderPage(this.state);
    } else {
      return <Loading />;
    }
  }
}