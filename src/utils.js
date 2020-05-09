// utils
export function parse(data) {
    if (data.includes('map:')) {
      return {
        map: data.replace('map:', ''),
      }
    }
  
    if (data.includes('open:')) {
      return {
        open: data.replace('open:', ''),
      }
    }
  
    if (data.includes('open:')) {
      return {
      }
    }
  }