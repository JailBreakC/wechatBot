"use strict"

const debug = require('debug')('supervise')

let supervise = {

    constructor() {
        this.superviseUsers = new Set()
        this.openTimes = 0
        this.on('mobile-open', () => this._botSupervise())

        this.on('login', () => {
            this.superviseUsers.add(this.user['UserName'])
        })
    },

    superviseList() {
        let members = this.friendList

        for (let member of members) {
            member.switch = this.superviseUsers.has(member.username)
        }

        return members
    },

    _botSupervise() {
        const message = '苏苏已经处理' + ++this.openTimes + '次任务啦！'
        for (let user of this.superviseUsers.values()) {

            //this.sendMsg(message, user)
            // 关闭提醒信息
            debug(message)
        }
    }
}

module.exports = supervise