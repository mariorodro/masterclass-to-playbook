/* Single data source for the site (browser: window.PLAYBOOK_DATA, Node: module.exports).
   Sample playbook: Richard D. Wyckoff ("Rollo Tape"), Studies in Tape Reading,
   The Ticker Publishing Company, New York, 1910. Public domain in the US.
   Page numbers are the printed page numbers of that 1910 edition, as scanned by the
   Internet Archive (item studiesintaperea00wyckrich, University of California Libraries copy).
   Quotes marked verbatim:true, and every inline quoted phrase, were checked word for word against the scan
   Everything else is a paraphrase. */
(function (root, factory) {
  var data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.PLAYBOOK_DATA = data;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  return {
    notice: 'Format sample, built from a public-domain 1910 classic. Not a video summary.',
    playbooks: [
      {
        id: 'wyckoff-tape-reading',
        type: 'book',
        title: 'Studies in Tape Reading',
        author: 'Richard D. Wyckoff (as "Rollo Tape")',
        edition: 'The Ticker Publishing Company, New York, 1910',
        length: '12 chapters \u00B7 about 180 pages',
        date: '1910',
        tags: ['tape reading', 'volume', 'stops', 'risk management', 'exits', 'psychology'],
        source: {
          label: 'Internet Archive scan (University of California Libraries copy)',
          url: 'https://archive.org/details/studiesintaperea00wyckrich',
          altLabel: 'Wikimedia Commons PDF',
          altUrl: 'https://commons.wikimedia.org/wiki/File:Studies_in_tape_reading_(IA_studiesintaperea00wyckrich).pdf',
          license: 'Public domain in the United States (published 1910, before January 1, 1931). Status may differ in other countries.'
        },
        chapters: [
          { ch: 'I', title: 'Introductory', p: 5 },
          { ch: 'II', title: 'Preliminary Suggestions', p: 20 },
          { ch: 'III', title: 'The Stock List Analyzed', p: 38 },
          { ch: 'IV', title: 'Stop Orders, Trading Rules, Etc.', p: 54 },
          { ch: 'V', title: 'Volumes and Their Significance', p: 75 },
          { ch: 'VI', title: 'Market Technique', p: 94 },
          { ch: 'VII', title: 'Dull Markets and Their Opportunities', p: 110 },
          { ch: 'VIII', title: 'The Use of Charts as Guides and Indicators', p: 126 },
          { ch: 'IX', title: 'Daily Trades vs. Long Pull Operations', p: 139 },
          { ch: 'X', title: 'Various Examples and Suggestions', p: 154 },
          { ch: 'XI', title: 'Obstacles to be Overcome \u2014 Possible Profits', p: 166 },
          { ch: 'XII', title: 'Closing the Trades \u2014 Suggestions for Students', p: 176 }
        ],
        lastPage: 187,
        historicalNote: 'Written for the 1909-1910 New York ticker: prices in fractions of a point, 100-share lots and fixed costs of about $39.50 per round trip. The rules below keep Wyckoff\u2019s logic; the numbers are his, from his market, and are not tested on today\u2019s markets. Wyckoff himself called these suggestions \u201Cnot to be considered final or inflexible.\u201D',
        historicalNoteRef: { ch: 'IV', p: 65, pEnd: 66 },
        setupsNote: 'Wyckoff doesn\u2019t name setups. These four are our grouping of his rules and worked examples, with the page each comes from.',
        tldr: [
          { text: 'Wyckoff defines tape reading as judging the immediate trend of prices from what the tape shows now, and the tape reader as someone who goes with that trend, never against it.', refs: [{ ch: 'I', p: 9 }, { ch: 'IV', p: 60 }] },
          { text: 'Volume shows which side is more urgent. When the big lots trade on the offer, buyers are pressing; when they hit the bid, sellers are. Judge size against the stock\u2019s normal activity.', refs: [{ ch: 'V', p: 75, pEnd: 76 }, { ch: 'V', p: 78 }] },
          { text: 'Let the market set the stop: just beyond the last point of resistance, then raise it to each new one as the trade works.', refs: [{ ch: 'IV', p: 58 }, { ch: 'IV', p: 62, pEnd: 64 }] },
          { text: 'Decide the risk before you enter. Except in very rare cases, change it only in the direction of profit, and never average down.', refs: [{ ch: 'IV', p: 65 }] },
          { text: 'Getting in right is only half the business, he says; knowing when to close matters as much or more. Get out when the tape says so, when the stop is hit, when the picture is unclear, or on a large or satisfactory profit.', refs: [{ ch: 'IV', p: 66 }, { ch: 'XII', p: 176 }] }
        ],
        setups: [
          {
            name: 'Go with the line of least resistance',
            conditions: [
              'The immediate trend is clear in the leading stocks (Wyckoff watched the most active leaders, where big money shows first).',
              'The market is actually swinging. A stock moving inside a couple of points has no trend; skip it.',
              'Volume is on the side of the move: the large lots trade where the pressure is.'
            ],
            entry: 'Act the moment a definite indication shows. He calls seeing a clear signal and not acting on it \u201Cfatal\u201D, even more so when closing than opening.',
            stop: 'Just beyond the most recent point of resistance (the level where the last reaction turned).',
            exit: 'Raise the stop to each new point of resistance as the move extends. Close when the tape shows the trend has turned.',
            refs: [{ ch: 'IV', p: 58 }, { ch: 'IV', p: 60, pEnd: 61 }, { ch: 'V', p: 75, pEnd: 76 }, { ch: 'V', p: 87 }]
          },
          {
            name: 'Higher low at a point of resistance (long)',
            conditions: [
              'A stock swinging in a narrow range has met buying at the same level more than once.',
              'The latest dip turns up a fraction above that level, a higher low that shows the selling pressure is weakening.'
            ],
            entry: 'Buy as the stock turns up from the higher low. (His example: a stock between 128 and 129 gives a buying signal on the third, slightly higher dip.)',
            stop: 'A fraction below the last point of resistance, so the initial risk is small and set by the market, not by a fixed amount.',
            exit: 'Once it pushes clearly through the old top, raise the stop to cost plus commissions. After each new high, move it up to the low of the latest dip.',
            refs: [{ ch: 'IV', p: 62, pEnd: 64 }]
          },
          {
            name: 'Worked example: heavy volume that can\u2019t advance (Reading, Jan. 4, 1909)',
            example: true,
            conditions: [
              'A leader trades huge volume inside a very small range but fails to go higher (his example: over 50,000 shares of Reading within three-quarters of a point).',
              'Wyckoff notes the volume may have been wash sales; he can\u2019t tell. What counts is that the stock couldn\u2019t advance.',
              'The rest of the list responds poorly, and other leaders show weak support on dips.',
              'The general market goes dull and hollow after the push.'
            ],
            entry: 'He waits for a clear cue. Here it was a sudden break in Consolidated Gas. Then he sells Reading at the market, picking it because the public likely bought its bulge and will sell on the first weakness.',
            stop: 'Just above the former top where the heavy volume traded.',
            exit: 'The example doesn\u2019t say where he covered. His general rule (Ch. VI): an exceptionally violent move after a long rise or sag usually marks its culmination.',
            refs: [{ ch: 'IV', p: 67, pEnd: 70 }, { ch: 'IV', p: 71, pEnd: 72 }, { ch: 'V', p: 85 }, { ch: 'VI', p: 99 }]
          },
          {
            name: 'Dull market, end of absorption (long)',
            conditions: [
              'The stock or market has gone dull: swings narrow like a clock pendulum running down. He says a pronounced swing one way or the other comes next.',
              'Signs of technical strength: bear raids fail to shake out much stock, and prices do not fall on bad news.',
              'The tape shows that the floating supply is being absorbed in a range.'
            ],
            entry: 'Buy when the stock signals that absorption is finished (his example: Reading ranged 120 to 124\u00BD, then gave the signal around 125).',
            stop: 'The chapter gives no specific level. Apply the Chapter IV rule: just beyond the nearest point of resistance.',
            exit: 'Trade part of the position. Hold the rest with a raised stop, and sell it when the tape shows inside distribution.',
            refs: [{ ch: 'VII', p: 110, pEnd: 114 }, { ch: 'IV', p: 58 }]
          }
        ],
        riskRules: [
          { text: 'Decide the risk at the outset. Except in very rare cases, change it only in the direction of profit.', refs: [{ ch: 'IV', p: 65 }] },
          { text: 'No averaging. Adding to a loser is \u201Cgroping for the top or bottom.\u201D', refs: [{ ch: 'IV', p: 65 }] },
          { text: 'Count costs on entry: add commissions to the buy price (or subtract from the sale) right away.', refs: [{ ch: 'IV', p: 54, pEnd: 56 }] },
          { text: 'Trade a size you can bear. Over-trading is the chief cause of fear.', refs: [{ ch: 'IV', p: 60 }] },
          { text: 'Each risk should hold a probable two to five points of profit; otherwise it does not pay its costs.', refs: [{ ch: 'IV', p: 61 }] },
          { text: 'Always have a stop in when away from the tape, when the ticker fails, or when carrying a position overnight.', refs: [{ ch: 'IV', p: 56, pEnd: 57 }] },
          { text: 'His own preference: a mental stop, closed with a market order when hit, so he always knows whether he\u2019s in or out. Resting stops are for when he\u2019s away from the tape. Automatic trailing stops, he says, get in the way of judgment.', refs: [{ ch: 'IV', p: 62 }, { ch: 'IV', p: 58, pEnd: 59 }] },
          { text: 'Fallback stop when you cannot watch: experienced traders of his day favored a two-point maximum gross loss per trade. He calls it \u201Cpurely arbitrary\u201D, a fallback for when you can\u2019t watch.', refs: [{ ch: 'IV', p: 58 }] },
          { text: 'With a couple of points of profit, do not let the trade fall back below net cost.', refs: [{ ch: 'IV', p: 56 }] },
          { text: 'Don\u2019t cap profits in advance: a trade that looks good for 3 or 4 points can run 10 if strength builds. (In Ch. XII he later leans toward taking quick moves at their culmination.)', refs: [{ ch: 'IV', p: 65 }, { ch: 'XII', p: 178 }] }
        ],
        closeRules: [
          { text: 'The tape says so: the trend has turned, in the stock itself, in another leader, or in the market as a whole.', refs: [{ ch: 'IV', p: 66, pEnd: 70 }] },
          { text: 'The stop is caught.', refs: [{ ch: 'IV', p: 66 }] },
          { text: 'The position is no longer clear.', refs: [{ ch: 'IV', p: 66 }] },
          { text: 'There is a large or satisfactory profit. In Ch. XII he revises this: close at the culmination of the immediate move, when volume and activity swell until \u201Ccomparatively riotous conditions prevail.\u201D', refs: [{ ch: 'IV', p: 66 }, { ch: 'XII', p: 176, pEnd: 180 }] },
          { text: 'In a market with enough breadth and swing, the time to close is usually the time to reverse.', refs: [{ ch: 'IV', p: 66, pEnd: 67 }] }
        ],
        checklist: [
          'Immediate trend of the leaders identified',
          'The market is swinging, not stuck in a tight range',
          'Volume is on my side of the trade',
          'Volume judged against this stock\u2019s normal activity',
          'A definite signal, acted on without hesitation',
          'Stop chosen first: beyond the last point of resistance',
          'Probable move pays costs and leaves a profit',
          'Commissions added to my entry price',
          'Size small enough that fear will not run the trade',
          'No averaging down',
          'Stop in place if I leave the screen or hold overnight',
          'Exit plan: tape signal, stop, unclear picture, or a satisfactory profit'
        ],
        quotes: [
          { text: 'Prices follow the line of least resistance.', ref: { ch: 'V', p: 87 }, verbatim: true },
          { text: 'The Tape is the pilot and the engineer must obey orders with promptness and precision.', ref: { ch: 'IV', p: 60 }, verbatim: true },
          { text: 'Fear, hesitation and uncertainty are deadly enemies of the Tape Reader.', ref: { ch: 'IV', p: 60 }, verbatim: true },
          { text: 'No yacht can win in a dead calm.', ref: { ch: 'IV', p: 61 }, verbatim: true },
          { text: 'The Tape Reader must not grope. He must see and know, or he should not act.', ref: { ch: 'IV', p: 65 }, verbatim: true },
          { text: 'Knowing when to close a trade is just as important, if not the most important part of a complete transaction.', ref: { ch: 'XII', p: 176 }, verbatim: true }
        ]
      }
    ]
  };
});
