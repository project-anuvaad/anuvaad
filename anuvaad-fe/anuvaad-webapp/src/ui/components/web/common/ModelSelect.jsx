import React from "react";
import PropTypes from "prop-types";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Checkbox from '@material-ui/core/Checkbox';


class ModelSelect extends React.Component {
    
    state = {
        name: [],
      };

      handleChange = event => {
        this.setState({ name: event.target.value });
      };
    

    render() {
      const { id,selectValue, MenuItemValues, handleChange, name} = this.props;
        var val=[]
        return (
          <form>
            <FormControl>
              <Select
                id="select-multiple-chip"
                multiple={true}
                style={{minWidth: 160,align:'right',maxWidth: 160}}
                value={this.state.name}
                onChange={this.handleChange}
                input={<OutlinedInput name={name} id="select-multiple-checkbox" />} >
                  {MenuItemValues.map((item) => (
                    <MenuItem key={item} value={item}><Checkbox checked={this.state.name.indexOf(item) > -1} />{item}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </form>
        );
      }
    }
    
export default (ModelSelect);