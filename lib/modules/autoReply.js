"use strict"

const debug = require('debug')('autoReply')

let autoReply = {

    constructor() {

        this.replyUsers = new Set()
        this.isChat = new Set()
        this.on('text-message', msg => this._botReply(msg))

        this.on('login', () => {
            this.replyUsers.add(this.user['UserName'])
            this.sendMsg("╮(╯▽╰)╭，我是贝爷的机器人贝贝，欢迎调戏。", this.user['UserName'])
        })

    },

    autoReplyList() {

        let members = this.friendList

        for (let member of members) {
            member.switch = this.replyUsers.has(member.username)
        }

        return members
    },

    _tuning(word) {

        let params = {
            'key': 'e0dd200b0dd9c0f51dcc452df3be3a3d',
            'info': word
        }

        return this.axios.request({
            method: 'GET',
            url: 'http://www.tuling123.com/openapi/api',
            params: params
        }).then(res => {

            const data = res.data
            if (data.code == 100000) {
                return data.text // + '[微信机器人]'
            } throw new Error("tuning返回值code错误", data)

        }).catch(err => {
            debug(err)
            return "不不不，我不告诉你！"
        })

    },

    _botReplyGroup(msg) {

        msg['Content'] = msg['Content'].split(':<br/>')[1]
        debug('群消息', msg['Content'])
        
        if (msg['Content'].startsWith('@' + this.user.NickName)) {

            msg['Content'] = msg['Content'].replace('@' + this.user.NickName, '')

            if (!this.isChat.has(msg['FromUserName'])) {                
                this.isChat.add(msg['FromUserName'])
                debug(msg['FromUserName'])
            }

            this._tuning(msg['Content']).then((reply) => {
                this.sendMsg(reply, msg['FromUserName'])
                debug('自动回复:', reply)
            })
        }

    },

    _botReplyMember(msg) {

        //关闭机器人
        if (msg['Content'] == "close_ai") {

            this.sendMsg("报告长官，AI队长贝贝即将奔赴前线！，再会了！", msg['FromUserName'])
            this.replyUsers.delete(msg['FromUserName'])

        } else {

            if (!this.isChat.has(msg['FromUserName'])) {                
                this.isChat.add(msg['FromUserName'])
                debug(msg['FromUserName'])
            }

            this._tuning(msg['Content']).then((reply) => {
                this.sendMsg(reply, msg['FromUserName'])
                debug('自动回复:', reply)
            })

        }
    },

    _botReply(msg) {

        if (this.replyUsers.has(msg['FromUserName'])){

            if (msg['FromUserName'].substr(0, 2) == "@@") {                

                // 处理群组消息
                this._botReplyGroup(msg)

            } else {                
                
                // 处理用户消息
                this._botReplyMember(msg)

            }

        }
    }
}

module.exports = autoReply