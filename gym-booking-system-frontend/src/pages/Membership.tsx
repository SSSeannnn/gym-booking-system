import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMembershipStatus, cancelMembership, renewMembership, getMembershipPlans } from '../services/api';
import { format } from 'date-fns';
import type { MembershipPlan } from '../types/auth';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  expired: 'bg-red-100 text-red-800',
  cancelled: 'bg-yellow-100 text-yellow-800'
};

const statusText = {
  active: 'active',
  expired: 'expired',
  cancelled: 'cancelled'
};

export default function Membership() {
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: membership, isLoading, error } = useQuery({
    queryKey: ['membership'],
    queryFn: getMembershipStatus
  });

  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['membershipPlans'],
    queryFn: getMembershipPlans
  });

  const cancelMutation = useMutation({
    mutationFn: cancelMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership'] });
      setShowCancelModal(false);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    },
    onError: (error: any) => {
      setErrorMessage(error.message || 'Failed to cancel membership, please try again later');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  });

  const renewMutation = useMutation({
    mutationFn: (planId: string) => renewMembership(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership'] });
      setShowRenewModal(false);
      setSelectedPlanId(null);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    },
    onError: (error: any) => {
      setErrorMessage(error.message || 'Failed to renew membership, please try again later');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  });

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleRenew = () => {
    if (selectedPlanId) {
      renewMutation.mutate(selectedPlanId);
    } else {
      setErrorMessage('Please select a membership plan');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Failed to load membership information, please try again later</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 成功提示 */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          <p>Operation successful!</p>
        </div>
      )}

      {/* 错误提示 */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <p>{errorMessage}</p>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">Membership Status</h1>

      {/* 会员信息卡片 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">{membership?.planName}</h2>
            <span className={`px-3 py-1 rounded-full text-sm ${statusColors[membership?.status || 'expired']}`}>
              {statusText[membership?.status || 'expired']}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">会员ID</p>
            <p className="font-medium">{membership?.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Membership Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{format(new Date(membership?.startDate || ''), 'yyyy/MM/dd')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium">{format(new Date(membership?.endDate || ''), 'yyyy/MM/dd')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Auto Renew</p>
                <p className="font-medium">{membership?.autoRenew ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Actions</h3>
            <div className="space-y-4">
              {membership?.status === 'active' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? 'Processing...' : 'Cancel Membership'}
                </button>
              )}
              {membership?.status !== 'active' && (
                <button
                  onClick={() => setShowRenewModal(true)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Renew Membership
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 取消会员确认弹窗 */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Cancel Membership</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your membership? After cancellation, you will not be able to continue enjoying membership benefits until you renew.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => cancelMutation.mutate()}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? 'Processing...' : 'Confirm Cancel'}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                disabled={cancelMutation.isPending}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 续订会员弹窗 */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Select Membership Plan</h3>
            {isLoadingPlans ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {plans?.map((plan: MembershipPlan) => (
                    <div
                      key={plan._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPlanId === plan._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:border-blue-500'
                      }`}
                      onClick={() => handlePlanSelect(plan._id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{plan.name}</h4>
                          <p className="text-sm text-gray-500">{plan.description}</p>
                          <div className="mt-2">
                            <h5 className="text-sm font-medium text-gray-700">Membership Benefits:</h5>
                            <ul className="mt-1 space-y-1">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center">
                                  <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">¥{plan.price}</p>
                          <p className="text-sm text-gray-500">/{plan.durationDays} days</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={handleRenew}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={renewMutation.isPending || !selectedPlanId}
                  >
                    {renewMutation.isPending ? 'Processing...' : 'Confirm Renew'}
                  </button>
                  <button
                    onClick={() => {
                      setShowRenewModal(false);
                      setSelectedPlanId(null);
                    }}
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    disabled={renewMutation.isPending}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 