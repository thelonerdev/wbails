import { proto } from '../../WAProto/index.js'
import { type WAMessageContent, type AnyMessageContent, type MiscMessageGenerationOptions } from '../Types/index.js'
import { type WAProto as WAProtoType } from '../../WAProto/index.js'

export type ContentType = 'PAYMENT' | 'PRODUCT' | 'INTERACTIVE' | 'ALBUM' | 'EVENT' | 'POLL_RESULT' | 'ORDER' | 'GROUP_STATUS' | 'GROUP_LABEL' | null

export default class imup {
    constructor(utils: any, waUploadToServer: any, relayMessageFn: (jid: string, message: any, options: any) => Promise<void>)
    utils: any
    relayMessage: (jid: string, message: any, options: any) => Promise<void>
    waUploadToServer: any
    detectType(content: any): ContentType
    handlePayment(content: any, quoted?: any): Promise<{ requestPaymentMessage: proto.Message.IRequestPaymentMessage }>
    handleProduct(content: any, jid: string, quoted?: any): Promise<{ viewOnceMessage: { message: any } }>
    handleInteractive(content: any, jid: string, quoted?: any): Promise<{ interactiveMessage: any }>
    handleAlbum(content: any, jid: string, quoted?: any): Promise<any>
    handleEvent(content: any, jid: string, quoted?: any): Promise<any>
    handlePollResult(content: any, jid: string, quoted?: any): Promise<any>
    handleOrderMessage(content: any, jid: string, quoted?: any): Promise<any>
    handleGroupStory(content: any, jid: string, quoted?: any): Promise<any>
    handleGbLabel(content: any, jid: string): Promise<void>
}