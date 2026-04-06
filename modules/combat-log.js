export default class CombatLog {
    /**
     * 
     * @param {string} fileName 
     */
    constructor(fileName) {
        this._fetchReady = fetch(fileName).then(r => r.text()).then(t => this._rawLines = t.split(/\r?\n/)).then(
            () => { this._parseLines() }
        );
    }
    
    _logRules = [
        {
            rulePattern: /^Setup$/,
            /** @param {RegExpMatchArray} ruleMatch */
            createEvent: (ruleMatch) => ({
                type: "START",
            })
        },
        {
            rulePattern: /^(?<playerName>.+?) chose (?<playerChoice>heads|tails) for the opening coin flip\.$/,
            /** @param {RegExpMatchArray} ruleMatch */
            createEvent: (ruleMatch) => ({
                type: "COIN_FLIP_CHOICE",
                playerName: ruleMatch.groups ? ruleMatch.groups.playerName : "",
                playerChoice: ruleMatch.groups ? ruleMatch.groups.playerChoice : ""
            })
        },
        {
            rulePattern: /^(?<coinFlipWinner>.+?) won the coin toss\.$/,
            /** @param {RegExpMatchArray} ruleMatch */
            createEvent: (ruleMatch) => ({
                type: "COIN_FLIP_RESULT",
                coinFlipWinner: ruleMatch.groups ? ruleMatch.groups.coinFlipWinner : ""
            })
        },
        {
            rulePattern: /^(?<coinFlipWinner>.+?) decided to go (?<coinFlipWinnerChoice>first|second)\.$/,
            /** @param {RegExpMatchArray} ruleMatch */
            createEvent: (ruleMatch) => ({
                type: "COIN_FLIP_RESULT_CHOICE",
                coinFlipWinner: ruleMatch.groups ? ruleMatch.groups.coinFlipWinner : "",
                coinFlipWinnerChoice: ruleMatch.groups ? ruleMatch.groups.coinFlipWinnerChoice : ""
            })
        },
        {
            rulePattern: /^(?<playerName>.+?) drew (?<numCards>\d+) cards for the opening hand\.$/,
            /** @param {RegExpMatchArray} ruleMatch */
            createEvent: (ruleMatch) => ({
                type: "OPENING_HAND_DRAW",
                playerName: ruleMatch.groups ? ruleMatch.groups.playerName : "",
                numCards: ruleMatch.groups ? Number(ruleMatch.groups.numCards) : 0,
                cardList: [] }),
            lineHandler: CombatLog._cardListHandler
        }
    ];

    /**
     * @param {any} eventObj 
     * @param {string} rawLine 
     * @returns {boolean} true = processing complete, false = keep processing
     */
    static _cardListHandler(eventObj, rawLine) {
        if (rawLine.startsWith("-")) {
            return false;
        }
        
        if (rawLine.startsWith("•")) {
            const cardListRegEx = /\(([^)]+)\)\s([^,]+?)(?=,\s*\(|$)/g
            let match;
            
            while ((match = cardListRegEx.exec(rawLine)) !== null) {
                eventObj.cardList.push({
                    id: match[1],
                    name: match[2]
                });
            }

            return false;
        }

        return true;
    }

    _parseLines() {
        /** @type {any} */
        let eventObj = null;
        /** @type {function | null} */
        let lineHandlerOverride = null;
        
        this._rawLines.forEach(l => {
            let lineWasMatched = false;
            const rawLine = l.trim();

            if (rawLine) {
                if (lineHandlerOverride) {
                    if (lineHandlerOverride(eventObj, rawLine)) {
                        this._processEventObject(eventObj);
                        eventObj = null;
                        lineHandlerOverride = null;
                    }
                    return;
                }
                else {
                    for (const { rulePattern, createEvent, lineHandler } of this._logRules) {
                        const regExpMatch = rawLine.match(rulePattern);
                        if (regExpMatch) {
                            /** @type {any} */
                            eventObj = createEvent(regExpMatch);

                            if (lineHandler) {
                                lineHandlerOverride = lineHandler;
                            }
                            else {
                                this._processEventObject(eventObj);
                            }
                            
                            lineWasMatched = true;
                            break;
                        }
                    }

                    if (!lineWasMatched) {
                        console.warn("Unprocessed Line:", l);
                    }
                }
            }
        });
    }

    async debugPrint() {
        await this._fetchReady;
        console.log(this._rawLines);
    }

    /**
     * @param {any} obj 
     */
    _processEventObject(obj) {
        switch (obj.type) {
            case "START":
                console.log(`== Game Start ==`);
                break;
            case "COIN_FLIP_CHOICE":
                console.log(`${obj.playerName} chose ${obj.playerChoice}`);
                break;
            case "COIN_FLIP_RESULT":
                console.log(`${obj.coinFlipWinner} won the coin flip`);
                break;
            case "COIN_FLIP_RESULT_CHOICE":
                console.log(`${obj.coinFlipWinner} chose to go ${obj.coinFlipWinnerChoice}`);
                break;
            case "OPENING_HAND_DRAW":
                console.log(`${obj.playerName} drew ${obj.numCards} cards:`);
                obj.cardList.forEach(card => {
                    console.log(`- ${card.name}`);
                })
                break;
            default:
                console.error(`Unprocessed Event Type:`, obj.type);
        }
    }
}