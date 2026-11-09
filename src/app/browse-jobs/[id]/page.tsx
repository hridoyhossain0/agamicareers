import CompanyOverview from '@/componants/browse-jobs/Details-page/CompanyOverview';
import JobDescriptionDetail from '@/componants/browse-jobs/Details-page/JobDescriptionDetail';
import JobHeaderBar from '@/componants/browse-jobs/Details-page/JobHeaderBar';
import JobStatsGrid from '@/componants/browse-jobs/Details-page/JobStatsGrid';
import React from 'react';

const BrowseJobsDetailsPage = () => {
    return (
        <div className='bg-[#0B0B0F]'>
            <JobHeaderBar />
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start px-4 py-8">
                {/* Right Main Content Column - Declared first so it appears first on mobile screens */}
                <div className="md:col-span-2 w-full flex flex-col gap-6 order-1 md:order-none">
                    <JobStatsGrid />
                    <JobDescriptionDetail />
                </div>

                {/* Left Sidebar Column - Placed properly on desktop, sits underneath on mobile */}
                <div className="md:col-span-1 w-full relative top-0 md:sticky md:top-6">
                    <CompanyOverview />
                </div>
            </div>


        </div>
    );
};

export default BrowseJobsDetailsPage;