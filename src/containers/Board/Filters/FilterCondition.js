/* This is a filter component rendered on the BOARD. */
/* It takes in a part of the state.itemlist */

/* It will filter by a single condition. If the user selects 'New' from the dropdown, the BOARD component will only show new items. */

import React from 'react';
import Item from '../../../components/item';
import { Link } from 'react-router-dom';

const FilterCondition = ({ list, cond }) => {
  
  return (
    <div>
      {
        list.filter(i => {
          if (i.Condition) {
            return i.Condition.type === cond;
          }
        }).map(item => {
          return (
            <Item 
              name={item.name}
              image={item.file}
              body={item.body}
              price={item.price}
              condition={item.Condition.type}
              category={item.Category.name}
              updatedAt={item.updatedAt}
              key={item.id}
              id={item.id}
              user_id={item.user_id}
            />
          );
        })
      }
    </div>
  );
}

export default FilterCondition;