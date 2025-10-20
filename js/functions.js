function checkStringLenght(line, maxLenght){
  if (line.length <= maxLenght){
    return true;
  }
  return false;
}

function isPalindrome(str) {
  const cleanedStr = str.toLowerCase().replace(/\s/g, '');
  let left = 0;
  let right = cleanedStr.length - 1;

  while (left < right) {
    if (cleanedStr[left] !== cleanedStr[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

function extractNumber(str) {
  if (typeof str !== 'string') {
    return NaN;
  }

  const digits = str.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : NaN;
}

function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function isMeetingWithinWorkHours(workStart, workEnd, meetingStart, meetingDuration) {
  const workStartMinutes = timeToMinutes(workStart);
  const workEndMinutes = timeToMinutes(workEnd);
  const meetingStartMinutes = timeToMinutes(meetingStart);
  const meetingEndMinutes = meetingStartMinutes + meetingDuration;
  return meetingStartMinutes >= workStartMinutes && meetingEndMinutes <= workEndMinutes;
}
