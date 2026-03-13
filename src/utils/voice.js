function voicePrompt(text) {
    new Audio('https://tts.baidu.com/text2audio?cuid=baike&lan=ZH&ctp=2&pdt=301&vol=9&rate=32&per=4&tex=' + text).play()
}
export {
    voicePrompt
}