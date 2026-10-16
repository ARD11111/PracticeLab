import React, { useState } from 'react';

export default function MonthCalendar({ activityMap = {} }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Get total days in month (auto handles leap years 28/29/30/31)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get starting day of week for 1st of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  // Shift so Mon = 0, ..., Sun = 6
  const firstDayObj = new Date(year, month, 1);
  let startDayOfWeek = firstDayObj.getDay(); // 0 is Sun
  startDayOfWeek = (startDayOfWeek + 6) % 7; // Convert to Mon=0...Sun=6

  // Get days in previous month for leading offset numbers
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Real today's date for status determination
  const realToday = new Date();
  const realTodayStr = realToday.toISOString().split('T')[0];

  // Helper to format date YYYY-MM-DD
  const formatDateStr = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Build grid cells
  const calendarCells = [];

  // Leading days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    calendarCells.push({
      dayNum: prevMonthDays - i,
      isCurrentMonth: false,
      status: 'off'
    });
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDateStr(year, month, d);
    const count = activityMap[dateStr] || 0;
    
    // Determine status
    let status = 'upcoming';
    const cellDate = new Date(year, month, d);
    cellDate.setHours(23, 59, 59, 999);

    if (count > 0) {
      status = 'completed';
    } else if (cellDate < realToday && dateStr !== realTodayStr) {
      status = 'missed';
    } else {
      status = 'upcoming';
    }

    calendarCells.push({
      dayNum: d,
      dateStr,
      isCurrentMonth: true,
      status
    });
  }

  // Trailing days for next month to complete row of 7
  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    calendarCells.push({
      dayNum: d,
      isCurrentMonth: false,
      status: 'off'
    });
  }

  return (
    <div className="card" style={{ padding: '20px' }}>
      {/* Calendar Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handlePrevMonth} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} title="Previous Month">
            ‹
          </button>
          <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {monthNames[month]} {year}
          </span>
          <button onClick={handleNextMonth} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} title="Next Month">
            ›
          </button>
        </div>
        <button onClick={handleToday} className="btn btn-secondary btn-sm">
          Today
        </button>
      </div>

      {/* Weekday Labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '10px' }}>
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
          <div key={day} style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
        {calendarCells.map((cell, idx) => (
          <div 
            key={idx} 
            style={{ 
              height: '46px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justify: 'center',
              borderRadius: 'var(--radius-md)',
              opacity: cell.isCurrentMonth ? 1 : 0.35,
              fontSize: '13px',
              color: 'var(--text-primary)'
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '2px', fontSize: '12px', color: cell.isCurrentMonth ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {cell.dayNum}
            </div>
            
            {cell.isCurrentMonth && (
              <div style={{ height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cell.status === 'completed' && (
                  <span style={{ 
                    width: '18px', 
                    height: '18px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--accent-green-bg)', 
                    color: '#4ade80', 
                    border: '1px solid var(--accent-green-border)',
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justify: 'center', 
                    flexShrink: 0
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
                {cell.status === 'missed' && (
                  <span style={{ fontSize: '13px' }}>😭</span>
                )}
                {cell.status === 'upcoming' && (
                  <span style={{ 
                    display: 'inline-block', 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    border: '1px dashed var(--text-muted)' 
                  }}></span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justify: 'space-between', 
        gap: '12px',
        flexWrap: 'wrap',
        marginTop: '20px', 
        paddingTop: '16px', 
        borderTop: '1px solid var(--border-color)',
        fontSize: '13px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <span style={{ 
            width: '20px', 
            height: '20px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--accent-green-bg)', 
            color: '#4ade80', 
            border: '1px solid var(--accent-green-border)',
            display: 'inline-flex', 
            alignItems: 'center', 
            justify: 'center', 
            flexShrink: 0
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span>Completed</span>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <span style={{ fontSize: '15px', lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>😭</span>
          <span>Missed</span>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <span style={{ 
            width: '14px', 
            height: '14px', 
            borderRadius: '50%', 
            border: '1px dashed var(--text-muted)', 
            display: 'inline-block',
            flexShrink: 0
          }}></span>
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  );
}
