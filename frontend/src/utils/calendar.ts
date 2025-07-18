// utils/calendar.ts
import { startOfWeek, eachDayOfInterval, addDays, format, subDays } from 'date-fns'

/**
 * 지난 1년간의 날짜를 주-요일별 배열로 반환
 * [
 *   [ { date: '2024-07-20' }, … ], // 월요일부터 일요일까지
 *   [ … ], // 다음 주
 *   …
 * ]
 */
export function generateCalendarData() {
  const end = new Date()
  const start = subDays(end, 365)
  // GitHub 캘린더는 주 단위로 잘라서 53주 정도의 열(column)이 나옵니다.
  // 시작 주의 첫째 날(일요일)까지 포함시키기 위해 startOfWeek 처리
  const cursor = startOfWeek(start, { weekStartsOn: 0 }) 
  const totalDays = eachDayOfInterval({ start: cursor, end })
  const weeks: { date: string }[][] = []

  totalDays.forEach((d) => {
    const weekIdx = Math.floor(
      (differenceInCalendarDays(d, cursor)) / 7
    )
    if (!weeks[weekIdx]) weeks[weekIdx] = []
    weeks[weekIdx].push({ date: format(d, 'yyyy-MM-dd') })
  })

  return weeks
}

