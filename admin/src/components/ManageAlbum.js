import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Album from './Album';
import SearchWrapper from './SearchWrapper';

export default class ManageAlbum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      found: false,
      loading: true,
    };
    this.addRelationship = this.addRelationship.bind(this);
  }
  componentDidMount() {
    return fetch(`/albums/${this.props.match.params.id}`)
      .then(res => res.json())
      .then(dbAlbumInfo => this.setState({
        found: !_.isEmpty(dbAlbumInfo),
        loading: false,
      }));
  }
  addRelationship(targetId) {
    console.log('called');
    const property = {
      source: {
        label: 'Album',
        _id: this.props.match.params.id,
      },
      target: {
        label: 'Album',
        _id: targetId,
      },
      rel: {
        type: 'ALBUM_RECO',
        message: 'en dur pour le moment',
      },
    };
    fetch('/albums/add-album-relationship', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(property),
    }).then(res => res.json())
      .then((newRelation) => {
        console.log('relation created:', newRelation);
      });
  }
  render() {
    if (this.state.found) {
      return (
        <div>
          <div>
            <Album
              id={this.props.match.params.id}
              isUnderManagement
            />
          </div>
          <SearchWrapper isUnderManagement addRelationship={this.addRelationship} />
        </div>
      );
    }
    if (!this.state.loading) {
      return <h1> Pas d\'album trouvé :(</h1>;
    }
    return null;
  }
}
/*
Album.propTypes = {
  album: PropTypes.isRequired,
};*/
