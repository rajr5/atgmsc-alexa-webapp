import React from 'react'
import { Drawer, ListItem, makeSelectable, Subheader } from 'material-ui';
import { Auth } from '../models/models';


export interface NavigationProps {
  header: string,
  items: string[],
  activeItem: string,
  itemChanged: (newItem: string) => void,
  auth?: Auth
}

export const Navigation = (props: NavigationProps) => {
  console.info('Navigation props', props);

  function handleClick(e: any, item: string) {
    console.log('clicked', e);
    console.log('item', item);
    props.itemChanged(item);
  }

  console.log('Navigation', props);

  function getSelectedStyle(item: string): {[prop: string]: string} {
    if(props.activeItem === item) {
      // selected
      return { backgroundColor: '#E8E8E8' };
    } else {
      // not selected
      return { backgroundColor: '#FFFFFF' };
    }
  }

  return (
    <div>
      <Drawer open={true}>
        <Subheader>Items</Subheader>
        {props.items.map(item => {
          return (
            <ListItem
              key={item} style={getSelectedStyle(item)}
              onClick={(e) => handleClick(e, item)}
              >{item}
            </ListItem>)
        })}
      </Drawer>
    </div>
  )
}