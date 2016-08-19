import Component from 'vue-class-component'
import * as Vue from "vue";
import {Junk, JunkUser, JunkItem} from "./junk"
declare var CodeMirror: any;

@Component({
  props: {
  },
  template: `
    <div>
      <h1>Memo</h1>
      <p v-if="user">hello, {{user.displayName}}.</p>
      <button v-if="!user" @click="login">login</button>
      <div id="code" style="height:300px; width: 500px"></div>
      <button @click="send(message)">送信</button>
      <div v-for="item in itemsRev" track-by="$index">{{item}}</div>
    </div>
  `
})
export class App extends Vue {
  junk: Junk;
  user: JunkUser;
  message: string;
  items: any[];

  data(): any{
    return {
      user: {},
      message: "",
      items: []
    }
  }

  get itemsRev():any[]{
    return this.items.reverse()
  }

  ready(){
    var ins = CodeMirror(document.getElementById("code"), {
      mode: "text/html",
      theme: "monokai",
      lineWrapping: true,
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true
    });
    ins.on("change", (e: any)=>{
      this.message = e.getValue();
    })

    this.junk = new Junk((user: JunkUser)=>{
      this.user = user;
      this.junk.fetch(30, (item: JunkItem)=>{
        this.items.push(item.val().text)
        console.log(item.val().text);
        ins.getDoc().setValue("");
      })
    });
  }
  login(){
    this.junk.login();
  }

  send(message: string){
    this.junk.post(
      message
    )
  }
}