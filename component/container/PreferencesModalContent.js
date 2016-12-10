import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ListView,
  StyleSheet
} from 'react-native';

import { Card, Button } from 'react-native-material-design';
import {MKTextField} from 'react-native-material-kit';
import { Checkbox } from 'react-native-material-design';


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class PreferencesModalContent extends Component {

  //cartProducts, closeHandler
  constructor(props){
    super(props);

    this.onClose = props.closeHandler;
    this.onSave = props.saveHandler;
    this.selected = props.selected;

    this.allTags = props.tags;
    this.tagsView = new Map();

    this.allTags.forEach(tag => {
      if (this.selected.length > 0){
        this.tagsView.set(tag, this.selected.includes(tag));
      } else {
        this.tagsView.set(tag, true);
      }
    });

    this.state = {
      custom: []
    };

    this._buildResult = this._buildResult.bind(this);
    this._updateCustom = this._updateCustom.bind(this);
  }

  _buildResult(){
    const selectedTags = [];
    this.tagsView.forEach((checked, tag) => {
      if (checked){
        selectedTags.push(tag);
      }
    });

    this.onSave(selectedTags, this.state.custom);
  }

  _updateCustom(val){
    this.setState({
      custom: val.split(',').map(t=> t.trim())
    });
  }


  render(){
    return (
        <View style={{flex:1,  justifyContent: 'center', alignItems: 'stretch', margin: 20}}>
          <Card>
            <Card.Body>
              <View style={{justifyContent: 'center', alignItems: 'stretch', marginLeft: 10}}>
                <MKTextField placeholder='Custom Filters'
                             style={styles.textfield}
                             underlineEnabled={true}
                             onTextChange={this._updateCustom}
                             returnKeyType="next"
                />
              </View>
              <ListView
                  dataSource={ds.cloneWithRows(this.allTags)}
                  renderRow={ (tag) => {
                    return (
                        <View key={tag} style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center'
                        }}>
                          <Checkbox value='ok' checked={this.tagsView.get(tag)}
                                    onCheck={checked => {
                                      this.tagsView.set(tag, checked);
                                      this.forceUpdate();
                                    }}
                          />

                          <Text style={{marginLeft:15, fontSize: 15, fontWeight: 'bold'}}>
                            {tag}
                          </Text>
                        </View>
                    );
                  }
                  }
              />
            </Card.Body>
            <Card.Actions position="right">
              <Button text="CLOSE" value="CLOSE" onPress={this.onClose}/>
              <Button text="SAVE" value="SAVE" onPress={this._buildResult}/>
            </Card.Actions>
          </Card>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    flex: 0.01,
    height: 0.1,
    backgroundColor: '#8E8E8E',
  },
  textfield: {
    width: 150,
    marginTop: 32,
  },
});
