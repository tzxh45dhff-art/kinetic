/**
 * Approximate monthly Nifty 50 closing prices (2010–2024).
 * Source: NSE India historical monthly close — simplified for demo.
 * Format: { year: number, month: number, close: number }
 */

export interface NiftyDataPoint {
  year: number
  month: number
  close: number
}

export const NIFTY_MONTHLY: NiftyDataPoint[] = [
  // 2010
  { year: 2010, month: 1, close: 4882 }, { year: 2010, month: 2, close: 4922 },
  { year: 2010, month: 3, close: 5249 }, { year: 2010, month: 4, close: 5278 },
  { year: 2010, month: 5, close: 5086 }, { year: 2010, month: 6, close: 5312 },
  { year: 2010, month: 7, close: 5368 }, { year: 2010, month: 8, close: 5402 },
  { year: 2010, month: 9, close: 5601 }, { year: 2010, month: 10, close: 6018 },
  { year: 2010, month: 11, close: 5863 }, { year: 2010, month: 12, close: 6135 },
  // 2011
  { year: 2011, month: 1, close: 5506 }, { year: 2011, month: 2, close: 5333 },
  { year: 2011, month: 3, close: 5834 }, { year: 2011, month: 4, close: 5749 },
  { year: 2011, month: 5, close: 5561 }, { year: 2011, month: 6, close: 5647 },
  { year: 2011, month: 7, close: 5482 }, { year: 2011, month: 8, close: 5001 },
  { year: 2011, month: 9, close: 4944 }, { year: 2011, month: 10, close: 5327 },
  { year: 2011, month: 11, close: 4832 }, { year: 2011, month: 12, close: 4624 },
  // 2012
  { year: 2012, month: 1, close: 5199 }, { year: 2012, month: 2, close: 5385 },
  { year: 2012, month: 3, close: 5296 }, { year: 2012, month: 4, close: 5248 },
  { year: 2012, month: 5, close: 4924 }, { year: 2012, month: 6, close: 5279 },
  { year: 2012, month: 7, close: 5229 }, { year: 2012, month: 8, close: 5259 },
  { year: 2012, month: 9, close: 5703 }, { year: 2012, month: 10, close: 5620 },
  { year: 2012, month: 11, close: 5880 }, { year: 2012, month: 12, close: 5905 },
  // 2013
  { year: 2013, month: 1, close: 6035 }, { year: 2013, month: 2, close: 5693 },
  { year: 2013, month: 3, close: 5683 }, { year: 2013, month: 4, close: 5930 },
  { year: 2013, month: 5, close: 5986 }, { year: 2013, month: 6, close: 5842 },
  { year: 2013, month: 7, close: 5742 }, { year: 2013, month: 8, close: 5471 },
  { year: 2013, month: 9, close: 5735 }, { year: 2013, month: 10, close: 6299 },
  { year: 2013, month: 11, close: 6176 }, { year: 2013, month: 12, close: 6304 },
  // 2014
  { year: 2014, month: 1, close: 6090 }, { year: 2014, month: 2, close: 6277 },
  { year: 2014, month: 3, close: 6704 }, { year: 2014, month: 4, close: 6696 },
  { year: 2014, month: 5, close: 7230 }, { year: 2014, month: 6, close: 7611 },
  { year: 2014, month: 7, close: 7721 }, { year: 2014, month: 8, close: 7954 },
  { year: 2014, month: 9, close: 7964 }, { year: 2014, month: 10, close: 8322 },
  { year: 2014, month: 11, close: 8588 }, { year: 2014, month: 12, close: 8283 },
  // 2015
  { year: 2015, month: 1, close: 8808 }, { year: 2015, month: 2, close: 8902 },
  { year: 2015, month: 3, close: 8491 }, { year: 2015, month: 4, close: 8182 },
  { year: 2015, month: 5, close: 8434 }, { year: 2015, month: 6, close: 8368 },
  { year: 2015, month: 7, close: 8533 }, { year: 2015, month: 8, close: 7971 },
  { year: 2015, month: 9, close: 7949 }, { year: 2015, month: 10, close: 8066 },
  { year: 2015, month: 11, close: 7935 }, { year: 2015, month: 12, close: 7946 },
  // 2016
  { year: 2016, month: 1, close: 7564 }, { year: 2016, month: 2, close: 6988 },
  { year: 2016, month: 3, close: 7738 }, { year: 2016, month: 4, close: 7850 },
  { year: 2016, month: 5, close: 8161 }, { year: 2016, month: 6, close: 8288 },
  { year: 2016, month: 7, close: 8639 }, { year: 2016, month: 8, close: 8786 },
  { year: 2016, month: 9, close: 8612 }, { year: 2016, month: 10, close: 8626 },
  { year: 2016, month: 11, close: 8225 }, { year: 2016, month: 12, close: 8186 },
  // 2017
  { year: 2017, month: 1, close: 8561 }, { year: 2017, month: 2, close: 8880 },
  { year: 2017, month: 3, close: 9174 }, { year: 2017, month: 4, close: 9304 },
  { year: 2017, month: 5, close: 9622 }, { year: 2017, month: 6, close: 9521 },
  { year: 2017, month: 7, close: 10077 }, { year: 2017, month: 8, close: 9918 },
  { year: 2017, month: 9, close: 9789 }, { year: 2017, month: 10, close: 10335 },
  { year: 2017, month: 11, close: 10227 }, { year: 2017, month: 12, close: 10531 },
  // 2018
  { year: 2018, month: 1, close: 11028 }, { year: 2018, month: 2, close: 10493 },
  { year: 2018, month: 3, close: 10113 }, { year: 2018, month: 4, close: 10739 },
  { year: 2018, month: 5, close: 10736 }, { year: 2018, month: 6, close: 10714 },
  { year: 2018, month: 7, close: 11356 }, { year: 2018, month: 8, close: 11681 },
  { year: 2018, month: 9, close: 10930 }, { year: 2018, month: 10, close: 10387 },
  { year: 2018, month: 11, close: 10877 }, { year: 2018, month: 12, close: 10863 },
  // 2019
  { year: 2019, month: 1, close: 10831 }, { year: 2019, month: 2, close: 10793 },
  { year: 2019, month: 3, close: 11624 }, { year: 2019, month: 4, close: 11748 },
  { year: 2019, month: 5, close: 11923 }, { year: 2019, month: 6, close: 11789 },
  { year: 2019, month: 7, close: 11118 }, { year: 2019, month: 8, close: 11023 },
  { year: 2019, month: 9, close: 11474 }, { year: 2019, month: 10, close: 11877 },
  { year: 2019, month: 11, close: 12056 }, { year: 2019, month: 12, close: 12168 },
  // 2020
  { year: 2020, month: 1, close: 11963 }, { year: 2020, month: 2, close: 11202 },
  { year: 2020, month: 3, close: 8598 },  // COVID crash
  { year: 2020, month: 4, close: 9860 },
  { year: 2020, month: 5, close: 9580 }, { year: 2020, month: 6, close: 10302 },
  { year: 2020, month: 7, close: 11073 }, { year: 2020, month: 8, close: 11388 },
  { year: 2020, month: 9, close: 11248 }, { year: 2020, month: 10, close: 11642 },
  { year: 2020, month: 11, close: 12969 }, { year: 2020, month: 12, close: 13982 },
  // 2021
  { year: 2021, month: 1, close: 13635 }, { year: 2021, month: 2, close: 14529 },
  { year: 2021, month: 3, close: 14691 }, { year: 2021, month: 4, close: 14631 },
  { year: 2021, month: 5, close: 15583 }, { year: 2021, month: 6, close: 15722 },
  { year: 2021, month: 7, close: 15763 }, { year: 2021, month: 8, close: 17132 },
  { year: 2021, month: 9, close: 17618 }, { year: 2021, month: 10, close: 17672 },
  { year: 2021, month: 11, close: 16983 }, { year: 2021, month: 12, close: 17354 },
  // 2022
  { year: 2022, month: 1, close: 17340 }, { year: 2022, month: 2, close: 16794 },
  { year: 2022, month: 3, close: 17465 }, { year: 2022, month: 4, close: 17102 },
  { year: 2022, month: 5, close: 16584 }, { year: 2022, month: 6, close: 15780 },
  { year: 2022, month: 7, close: 17158 }, { year: 2022, month: 8, close: 17759 },
  { year: 2022, month: 9, close: 17094 }, { year: 2022, month: 10, close: 18013 },
  { year: 2022, month: 11, close: 18758 }, { year: 2022, month: 12, close: 18105 },
  // 2023
  { year: 2023, month: 1, close: 17662 }, { year: 2023, month: 2, close: 17303 },
  { year: 2023, month: 3, close: 17360 }, { year: 2023, month: 4, close: 18065 },
  { year: 2023, month: 5, close: 18534 }, { year: 2023, month: 6, close: 19189 },
  { year: 2023, month: 7, close: 19727 }, { year: 2023, month: 8, close: 19254 },
  { year: 2023, month: 9, close: 19638 }, { year: 2023, month: 10, close: 19080 },
  { year: 2023, month: 11, close: 20133 }, { year: 2023, month: 12, close: 21732 },
  // 2024
  { year: 2024, month: 1, close: 21726 }, { year: 2024, month: 2, close: 22147 },
  { year: 2024, month: 3, close: 22327 }, { year: 2024, month: 4, close: 22604 },
  { year: 2024, month: 5, close: 22531 }, { year: 2024, month: 6, close: 23259 },
  { year: 2024, month: 7, close: 24509 }, { year: 2024, month: 8, close: 25236 },
  { year: 2024, month: 9, close: 25811 }, { year: 2024, month: 10, close: 24205 },
  { year: 2024, month: 11, close: 23914 }, { year: 2024, month: 12, close: 23645 },
]

/** Get month name from 1-indexed month */
export function getMonthName(month: number): string {
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return names[month - 1] || ''
}

/** Get full month name */
export function getMonthNameFull(month: number): string {
  const names = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  return names[month - 1] || ''
}

/** Get data filtered by start year */
export function getNiftyFromYear(startYear: number): NiftyDataPoint[] {
  return NIFTY_MONTHLY.filter(d => d.year >= startYear)
}
