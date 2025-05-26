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
  active: '有效',
  expired: '已过期',
  cancelled: '已取消'
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
      setErrorMessage(error.message || '取消会员失败，请稍后重试');
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
      setErrorMessage(error.message || '续订会员失败，请稍后重试');
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
      setErrorMessage('请选择一个会员计划');
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
        <div className="text-red-500">加载会员信息失败，请稍后重试</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 成功提示 */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          <p>操作成功！</p>
        </div>
      )}

      {/* 错误提示 */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <p>{errorMessage}</p>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">会员状态</h1>

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
            <h3 className="text-lg font-medium mb-4">会员详情</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">开始日期</p>
                <p className="font-medium">{format(new Date(membership?.startDate || ''), 'yyyy年MM月dd日')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">到期日期</p>
                <p className="font-medium">{format(new Date(membership?.endDate || ''), 'yyyy年MM月dd日')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">自动续费</p>
                <p className="font-medium">{membership?.autoRenew ? '已开启' : '未开启'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">操作</h3>
            <div className="space-y-4">
              {membership?.status === 'active' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? '处理中...' : '取消会员'}
                </button>
              )}
              {membership?.status !== 'active' && (
                <button
                  onClick={() => setShowRenewModal(true)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  续订会员
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
            <h3 className="text-xl font-semibold mb-4">确认取消会员</h3>
            <p className="text-gray-600 mb-6">
              您确定要取消会员吗？取消后，您将无法继续享受会员权益，直到您重新订阅。
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => cancelMutation.mutate()}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? '处理中...' : '确认取消'}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                disabled={cancelMutation.isPending}
              >
                返回
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 续订会员弹窗 */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">选择会员计划</h3>
            {isLoadingPlans ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {plans?.map((plan: MembershipPlan) => (
                    <div
                      key={plan.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPlanId === plan.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:border-blue-500'
                      }`}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{plan.name}</h4>
                          <p className="text-sm text-gray-500">{plan.description}</p>
                          <div className="mt-2">
                            <h5 className="text-sm font-medium text-gray-700">会员权益：</h5>
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
                          <p className="text-sm text-gray-500">/{plan.duration}个月</p>
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
                    {renewMutation.isPending ? '处理中...' : '确认续订'}
                  </button>
                  <button
                    onClick={() => {
                      setShowRenewModal(false);
                      setSelectedPlanId(null);
                    }}
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    disabled={renewMutation.isPending}
                  >
                    取消
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