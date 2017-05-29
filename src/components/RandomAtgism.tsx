import { getRandomAtgism, promoteAtgism } from '../services/dataservice';
import { ATGIsmLimitedResponse, ATGIsmPromote } from '../models/models';
import React from 'react';
import { Card, CardTitle, CardActions, CardHeader, CardText, FlatButton, RaisedButton, CircularProgress, Chip, Avatar } from 'material-ui';
import { SocialMood, SocialMoodBad, AvReplay, SocialWhatshot } from 'material-ui/svg-icons';
import { red500, red900, green500, blue500 } from 'material-ui/styles/colors';
import { CreateATGism } from './CreateATGism';
import { Auth } from '../models/models';

export interface AtgismState {
  atgism?: ATGIsmLimitedResponse;
  loading: boolean;
  isError?: boolean;
  error?: string;
  activePromo?: 'promote' | 'demote',
  likes?: number,
  dislikes?: number,
}

type AtgismProps = {
  auth?: Auth
}

// <props, state>
export class RandomAtgism extends React.Component<AtgismProps, AtgismState> {

  state: AtgismState;

  constructor(props: any) {
    super(props);
    console.info('RandomAtgism props', props);
    this.state = {
      atgism: undefined,
      loading: false,
      isError: false,
    };
    this.randomAtgism = this.randomAtgism.bind(this);
    this.promote = this.promote.bind(this);
    this.setActivePromo = this.setActivePromo.bind(this);
    this.findActivePromo = this.findActivePromo.bind(this);
    this.setLikesDislikes = this.setLikesDislikes.bind(this);
  }

  public componentDidMount() {
    this.randomAtgism();
    console.info('NavBar componentDidMount()', this.props);
  }

  randomAtgism() {
    console.log('randomAtgism()');
    this.setState({loading: true});
    getRandomAtgism()
    .then(atgism => {
      console.log('atgism', atgism);
      this.setState({atgism, isError: false, loading: false});
      this.setActivePromo(atgism);
      this.setLikesDislikes(atgism);
    })
    .catch(err => {
      console.log(err);
      this.setState({error: 'Error obtaining random atgism :(', isError: true, loading: false});
    });
  }

  setActivePromo(atgism) {
    if(atgism && atgism.promotions) {
      const exisitngPromo: ATGIsmPromote = this.findActivePromo(atgism.promotions);
      if(exisitngPromo) {
        const activePromo = exisitngPromo.score === 1 ? 'promote' : exisitngPromo.score === -1 ? 'demote' : null;
        this.setState({activePromo});
      }
    }
  }

  setLikesDislikes(atgism) {
    if(atgism && atgism.promotions) {
      const likesDislikes: {likes: number, dislikes: number} = atgism.promotions.reduce((acc, curr: ATGIsmPromote) => {
        if(curr.score > 0) {
          acc.likes += 1;
        } else if(curr.score < 0) {
          acc.dislikes += 1;
        }
        return acc;
      }, {likes: 0, dislikes: 0});
      this.setState({likes: likesDislikes.likes, dislikes: likesDislikes.dislikes});
    } else {
      this.setState({likes: 0, dislikes: 0});
    }
  }

  findActivePromo(promotions: ATGIsmPromote[]) {
    return promotions.find(p => p.name === this.props.auth.mail);
  }

  promote(ev) {
    const label: string = ev.target.innerText;
    let score: -1 | 0 | 1 = label.toLowerCase().startsWith('promote') ? 1 : -1;
    // if user already has same score, then toggle to 0 - otherwise keep score
    if(this.state.atgism.promotions) {
      const exisitngPromo: ATGIsmPromote = this.findActivePromo(this.state.atgism.promotions);
      if(exisitngPromo) {
        if(exisitngPromo.score === score) {
          score = 0;
        }
      }
    }
    promoteAtgism({
      person: this.state.atgism.person,
      message: this.state.atgism.message,
      name: this.props.auth.mail,
      score: score
    })
    .then((atgism: ATGIsmLimitedResponse) => {
      if(atgism && atgism.promotions) {
        console.log('updating atgims state', atgism);
        this.setState({atgism, isError: false, loading: false});
        this.setActivePromo(atgism);
        this.setLikesDislikes(atgism);
      } else {
        console.log('Returned ATGism did not include promotions', atgism);
      }
    })
    .catch(err => {
      console.log('Error promoting atgism', err);
    })
  }

  public render() {
    return (
      <Card>
        <CardHeader title="Daily ATGism" />
        {this.state.loading ?
          (<CardText> <CircularProgress /> </CardText>) :
          (this.state.atgism &&
            (<CardTitle
              title={this.state.atgism.message}
              subtitle={this.state.atgism.person} />)
          )
        }
        <CardActions>
          <FlatButton disabled={this.state.loading || !this.state.atgism} label="View Another ATGism" icon={<AvReplay color={blue500}></AvReplay>} onClick={this.randomAtgism}></FlatButton>
          {!this.state.loading && this.state.atgism && this.props.auth &&
            (<span>
              {this.state.activePromo === 'promote' ?
                <RaisedButton primary={true} disabled={this.state.loading || !this.state.atgism || this.state.isError} label="Promote (+1)" onClick={this.promote} icon={<SocialMood color={green500}></SocialMood>}></RaisedButton> :
                <FlatButton disabled={this.state.loading || !this.state.atgism || this.state.isError} label="Promote (+1)" onClick={this.promote} icon={<SocialMood color={green500}></SocialMood>}></FlatButton>
              }
              {this.state.activePromo === 'demote' ?
                <RaisedButton primary={true} disabled={this.state.loading || !this.state.atgism || this.state.isError} label="Demote (-1)" onClick={this.promote} icon={<SocialMoodBad color={red500}></SocialMoodBad>}></RaisedButton> :
                <FlatButton disabled={this.state.loading || !this.state.atgism || this.state.isError} label="Demote (-1)" onClick={this.promote} icon={<SocialMoodBad color={red500}></SocialMoodBad>}></FlatButton>
              }
            </span>)
          }
        </CardActions>
        {!this.state.loading && this.state.atgism &&
          (<CardText style={{display: 'flex', flexWrap: 'wrap'}}>
            <Chip><Avatar size={32} color={green500} backgroundColor="white" icon={<SocialMood></SocialMood>}></Avatar><strong>Likes:</strong> {this.state.likes}</Chip>
            <Chip><Avatar size={32} color={red500} backgroundColor="white" icon={<SocialMoodBad></SocialMoodBad>}></Avatar><strong>Dislikes:</strong> {this.state.dislikes}</Chip>
            {this.state.likes > 10 && <Chip><Avatar size={32} color={red900} backgroundColor="white" icon={<SocialWhatshot></SocialWhatshot>}></Avatar><strong>Hot</strong></Chip>}
          </CardText>)
        }
      </Card>
    );
  }
}