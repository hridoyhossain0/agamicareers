import JobResults from '@/componants/browse-jobs/JobResults';
import SearchBar from '@/componants/browse-jobs/SearchBar';
import React from 'react';

const BrowseJobsPage = () => {
    return (
        <div className='bg-[#0B0B0F]'>
            <SearchBar/>
            <JobResults/>
        </div>
    );
};

export default BrowseJobsPage;