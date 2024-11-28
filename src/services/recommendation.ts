import {
  getDistinctPrograms,
  getResidentsFromDateTime,
  getIsolatedResidents,
  programHasResidentHobbies,
  getProgramsForIsolatedResidents,
} from '../helpers/recommendation';


export class Recommendation {
  
  static getProgramsForIsolatedResidents(fromDateTime: number): string[] {
                        
    // get all distinct programs
    const distinctPrograms = getDistinctPrograms(); 
    
    const residentsRecentlyAttended = getResidentsFromDateTime(fromDateTime) ;
    
    const isolatedResidents = getIsolatedResidents(residentsRecentlyAttended);
    // find common hobbies between the non-attendees (most of them)
    const programCount = getProgramsForIsolatedResidents(isolatedResidents, distinctPrograms);

    const topPrograms:[string, number][] = [...programCount.entries()];
    topPrograms.sort((a,b) => a[1] > b[1] ? -1 : 1);
    return topPrograms.map(p => p[0]);
  }

}
