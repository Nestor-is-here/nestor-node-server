import mqtt from 'mqtt'

class mqClient {
    
    constructor(url) {
        this.client = mqtt.connect(url)
        this.client.on('connect', () => {
            console.log('Broker Connected')
        })
        this.client.on('close', () => {
            console.log('Broker Disconnected')
        })
    }
    
    publish(topic, message) {
        if(this.client.connected) {
            this.client.publish(topic,message)
        }
        else {
            console.log('Client Disconnected')
            while (!this.client.connected) {
                this.client.reconnect(url)
            }
            this.client.publish(topic,message)
        }
    }
    
}

export { mqClient }