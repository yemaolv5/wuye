import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  FileText, 
  Download, 
  Settings2, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Users,
  CreditCard
} from 'lucide-react';
import { PlanningInput, generateNotice, exportToWord } from './services/noticeService';

export default function App() {
  const [input, setInput] = useState<PlanningInput>({
    communityName: '阳光壹号院',
    propertyName: '金牌物业',
    occupancyPhase: '已入住',
    feePhase: '收费多年',
    node: '自然年度届满前一个月',
    deadline: '2026-12-31',
  });

  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const content = generateNotice(input);
      setGeneratedContent(content);
      setIsGenerating(false);
    }, 800);
  };

  const handleDownload = async () => {
    const title = `${input.communityName}线上缴费活动通知`;
    await exportToWord(title, generatedContent);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Settings2 className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">物业线上缴费策划系统</h1>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            自动化生成 · 专业模板 · 一键导出
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold">场景参数配置</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">小区名称</label>
                  <input
                    type="text"
                    value={input.communityName}
                    onChange={(e) => setInput({ ...input, communityName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="请输入小区名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">物业公司</label>
                  <input
                    type="text"
                    value={input.propertyName}
                    onChange={(e) => setInput({ ...input, propertyName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="请输入物业公司名称"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">入驻阶段</label>
                    <select
                      value={input.occupancyPhase}
                      onChange={(e) => setInput({ ...input, occupancyPhase: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option>新入驻</option>
                      <option>已入住</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">收费阶段</label>
                    <select
                      value={input.feePhase}
                      onChange={(e) => setInput({ ...input, feePhase: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option>首次收费</option>
                      <option>刚开始收费</option>
                      <option>收费多年</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">关键节点</label>
                  <select
                    value={input.node}
                    onChange={(e) => setInput({ ...input, node: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>普通日期</option>
                    <option>服务年度届满前一个月</option>
                    <option>自然年度届满前一个月</option>
                    <option>服务年度届满日</option>
                    <option>自然年度届满日</option>
                    <option>年中</option>
                    <option>10月1日</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">活动截止日期</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={input.deadline}
                      onChange={(e) => setInput({ ...input, deadline: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  生成策划方案
                </button>
              </div>
            </section>

            {/* Quick Tips */}
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="text-indigo-900 font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                策划建议
              </h3>
              <ul className="text-sm text-indigo-700 space-y-2">
                <li>• 针对“已入住”小区，建议在年底前一个月启动清缴预热。</li>
                <li>• 首次上线的“新入驻”小区，重点在于降低门槛和实名认证。</li>
                <li>• 结合节假日（如国庆）发放“限时福利”能有效提升转化。</li>
              </ul>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-7">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full min-h-[600px]">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold">通知预览</h2>
                </div>
                {generatedContent && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    导出 Word
                  </button>
                )}
              </div>

              <div className="flex-1 p-8 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {generatedContent ? (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="prose prose-indigo max-w-none"
                    >
                      <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300 min-h-[400px] whitespace-pre-wrap font-serif text-lg leading-relaxed text-gray-800">
                        {generatedContent}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4"
                    >
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8" />
                      </div>
                      <p>暂无生成内容，请在左侧配置参数并点击生成</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-400 text-sm">
        © 2026 物业缴费场景自动化策划系统 · 助力智慧社区数字化转型
      </footer>
    </div>
  );
}
