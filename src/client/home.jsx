import React, { Component } from 'react';
import format from 'date-fns/format';
import differenceInMonths from 'date-fns/difference_in_months'
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

const renderPage = function ({ drafts, numEntries, numDrafts }) {
  const totalEntries = <h1>{`${numEntries} entries loaded`}</h1>
  const totalDraft = <h2>{`${numDrafts} waiting to be published`}</h2>;
  const humanDrafts = drafts.map(draft => {
    let className = 'collection-item ';
    const updated = new Date(draft.updated);
    const now = new Date();
    const difference = differenceInMonths(now, updated);
    
    if (difference >= 3) {
      className += 'yellow lighten-4';
    } else if (difference >= 6) {
      className += 'red lighten-4';
    }

    const humanDate = format(updated, 'dddd Do MMMM YYYY');
    return (
    <a key={draft.contentfulLink} className={className} href={draft.contentfulLink} target='_blank' rel='noopener'>
        <span className='title collection-title'>{draft.title}</span>
        <p>
          <b>Content Type:</b> {draft.contentType}
          <br />
          <b>Last Updated:</b> {humanDate}
        </p>
    </a>
  )
  });
  return (
    <div className='entries'>
      {totalEntries}
      {totalDraft}
      <div className='center-align'>
      <a 
        className="waves-effect waves-light btn indigo darken-3" 
        onClick={ () => {
          const { drafts, order } = this.state;
          const rev = drafts.reverse();
          const newOrder = order === 'Newest to Oldest' ? 'Oldest to Newest' : 'Newest to Oldest';

          this.setState({ drafts: rev, order: newOrder });
        }}>
          {`Current Order: ${this.state.order}`}
        </a>
        </div>
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
      order: 'Oldest To Newest'
    }
    this.loaded = false;
    this.renderPage = renderPage.bind(this);
  }

  async componentWillMount() {
    const blob = await fetch('/api/contentful/drafts');
    const json = await blob.json();
    this.loaded = true;
    Materialize.toast('Page Updated', 4000)
    this.setState(json);
  }

  render() {
    if (this.loaded) {
      return this.renderPage(this.state);
    } else {
      return <Loading />;
    }
  }
}