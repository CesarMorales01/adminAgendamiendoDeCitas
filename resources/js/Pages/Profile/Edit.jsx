import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DialogoContrato from '../UIGeneral/DialogoContrato';

export default function Edit({ auth, mustVerifyEmail, status, globalVars }) {

    function aceptarContrato(){
        const exp= 3600*60*24*365*10
        glob.setCookie('contrato', 'ok', exp)
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
            globalVars={globalVars}
        >
            <Head title="Profile" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <button type='button' data-toggle="modal" data-target="#modalContrato" className='btn btn-info'>Términos y condiciones de uso de servicios GenialApp</button>
                    </div>
                </div>
            </div>
            <DialogoContrato aceptarContrato={aceptarContrato}></DialogoContrato>
        </AuthenticatedLayout>
    );
}
