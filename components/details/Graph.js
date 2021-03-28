const data = [
  {
    "day": "2021-01-09",
    "value": 267
  },
  {
    "day": "2021-02-17",
    "value": 331
  },
  {
    "day": "2021-02-27",
    "value": 189
  },
  {
    "day": "2021-01-22",
    "value": 107
  },
  {
    "day": "2021-03-09",
    "value": 207
  },
  {
    "day": "2021-03-01",
    "value": 392
  },
  {
    "day": "2021-01-01",
    "value": 179
  },
  {
    "day": "2021-02-13",
    "value": 79
  },
  {
    "day": "2021-02-03",
    "value": 289
  },
  {
    "day": "2021-03-31",
    "value": 322
  },
  {
    "day": "2021-03-27",
    "value": 29
  },
  {
    "day": "2021-03-28",
    "value": 214
  },
  {
    "day": "2021-03-11",
    "value": 104
  },
  {
    "day": "2021-03-29",
    "value": 108
  },
  {
    "day": "2021-03-02",
    "value": 379
  },
  {
    "day": "2021-03-07",
    "value": 66
  },
  {
    "day": "2021-03-23",
    "value": 147
  },
  {
    "day": "2021-02-06",
    "value": 60
  },
  {
    "day": "2021-01-18",
    "value": 269
  },
  {
    "day": "2021-01-31",
    "value": 355
  },
  {
    "day": "2021-01-21",
    "value": 118
  },
  {
    "day": "2021-02-04",
    "value": 309
  },
  {
    "day": "2021-03-14",
    "value": 208
  },
  {
    "day": "2021-01-23",
    "value": 57
  },
  {
    "day": "2021-01-10",
    "value": 56
  },
  {
    "day": "2021-02-12",
    "value": 190
  },
  {
    "day": "2021-01-16",
    "value": 126
  },
  {
    "day": "2021-03-13",
    "value": 32
  },
  {
    "day": "2021-01-25",
    "value": 230
  },
  {
    "day": "2021-03-06",
    "value": 90
  },
  {
    "day": "2021-02-10",
    "value": 1
  },
  {
    "day": "2021-03-08",
    "value": 117
  },
  {
    "day": "2021-01-04",
    "value": 220
  },
  {
    "day": "2021-02-28",
    "value": 290
  },
  {
    "day": "2021-02-23",
    "value": 281
  },
  {
    "day": "2021-02-11",
    "value": 377
  },
  {
    "day": "2021-02-21",
    "value": 47
  },
  {
    "day": "2021-01-15",
    "value": 156
  },
  {
    "day": "2021-03-12",
    "value": 119
  },
  {
    "day": "2021-02-19",
    "value": 302
  },
  {
    "day": "2021-02-07",
    "value": 157
  },
  {
    "day": "2021-03-24",
    "value": 326
  },
  {
    "day": "2021-02-24",
    "value": 234
  },
  {
    "day": "2021-03-04",
    "value": 398
  },
  {
    "day": "2021-03-03",
    "value": 381
  },
  {
    "day": "2021-02-18",
    "value": 103
  },
  {
    "day": "2021-01-29",
    "value": 0
  },
  {
    "day": "2021-02-08",
    "value": 248
  },
  {
    "day": "2021-02-20",
    "value": 63
  },
  {
    "day": "2021-01-07",
    "value": 106
  },
  {
    "day": "2021-01-19",
    "value": 64
  },
  {
    "day": "2021-01-11",
    "value": 355
  },
  {
    "day": "2021-01-02",
    "value": 337
  },
  {
    "day": "2021-03-30",
    "value": 213
  },
  {
    "day": "2021-01-03",
    "value": 87
  },
  {
    "day": "2021-02-14",
    "value": 243
  },
  {
    "day": "2021-02-25",
    "value": 291
  },
  {
    "day": "2021-01-20",
    "value": 111
  },
  {
    "day": "2021-01-05",
    "value": 111
  },
  {
    "day": "2021-01-08",
    "value": 321
  },
  {
    "day": "2021-03-10",
    "value": 375
  },
  {
    "day": "2021-03-17",
    "value": 15
  },
];


import { ResponsiveCalendar } from '@nivo/calendar'

const MyResponsiveCalendar = () => (
    <ResponsiveCalendar
        data={data}
        from="2021-03-01"
        to="2021-03-28"
        emptyColor="#eeeeee"
        colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        yearSpacing={40}
        monthBorderColor="#ffffff"
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'row',
                translateY: 36,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 36,
                itemsSpacing: 14,
                itemDirection: 'right-to-left'
            }
        ]}
    />
)

export default MyResponsiveCalendar;