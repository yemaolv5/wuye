import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

export interface PlanningInput {
  communityName: string;
  propertyName: string;
  occupancyPhase: string;
  feePhase: string;
  node: string;
  deadline: string;
}

export const SCENARIOS = [
  {
    id: 1,
    description: "新入驻 / 首次收费 / 普通日期",
    match: (input: PlanningInput) => input.occupancyPhase === '新入驻' && input.feePhase === '首次收费' && input.node === '普通日期',
    template: "【通知】[小区名称]智慧生活开启，线上缴费便捷上线！\n\n尊贵的业主：欢迎入驻[小区名称]！为提供更高效的服务，我司正式启用微信小程序线上缴费。即日起，您无需前往物业中心，手机点点即可完成缴费。[限时福利]：即日起至[截止日期]注册小程序，即可领取百元优惠券。感谢您的支持！\n\n[物业公司]\n[日期]"
  },
  {
    id: 2,
    description: "新入驻 / 首次收费 / 服务年度届满前一个月",
    match: (input: PlanningInput) => input.occupancyPhase === '新入驻' && input.feePhase === '首次收费' && input.node === '服务年度届满前一个月',
    template: "【预热通知】[小区名称]首年服务即将届满，线上缴费提前体验！\n\n尊贵的业主：[小区名称]首个服务年度即将期满。为优化续费流程，我们为您准备了便捷的小程序入口。[限时福利]：即日起至[截止日期]注册并实名认证小程序，即可领取百元优惠券。快来提前感受智慧物业吧！\n\n[物业公司]\n[日期]"
  },
  {
    id: 3,
    description: "新入驻 / 刚开始收费 / 10月1日",
    match: (input: PlanningInput) => input.occupancyPhase === '新入驻' && input.feePhase === '刚开始收费' && input.node === '10月1日',
    template: "【新邻礼遇】[小区名称]线上缴费上线，国庆注册领优惠！\n\n尊贵的业主：正值新居入驻与国庆双喜临门，[物业公司]线上办公厅正式开放。缴费、报修一站式搞定。[限时福利]：即日起至[截止日期]注册小程序，即可领取百元优惠券。欢迎新业主开启智慧居家生活！\n\n[物业公司]\n[日期]"
  },
  {
    id: 4,
    description: "已入住 / 收费多年 / 自然年度届满前一个月",
    match: (input: PlanningInput) => input.occupancyPhase === '已入住' && input.feePhase === '收费多年' && input.node === '自然年度届满前一个月',
    template: "【提醒】[小区名称]年度物业费汇算开始，线上缴费更省心！\n\n尊贵的业主：[年份]年度即将步入尾声，感谢您长久以来的配合。为方便大家进行年度费用结算，我们现已开通小程序线上渠道。[限时福利]：即日起至[截止日期]注册小程序，即可领取百元优惠券，直抵物业费。足不出户，轻松缴费。\n\n[物业公司]\n[日期]"
  },
  {
    id: 5,
    description: "已入住 / 刚开始收费 / 服务年度届满日",
    match: (input: PlanningInput) => input.occupancyPhase === '已入住' && input.feePhase === '刚开始收费' && input.node === '服务年度届满日',
    template: "【重要通知】[小区名称]首个服务年度届满，线上缴费通道正式开启\n\n尊贵的业主：在您的陪伴下，我们共同度过了首个服务年度。现正式启用小程序缴费功能，旨在为您提供更透明、便捷的账单查询与支付体验。[限时福利]：即日起至[截止日期]注册小程序，即可领取百元优惠券。让我们共建美好社区！\n\n[物业公司]\n[日期]"
  },
  {
    id: 6,
    description: "已入住 / 收费多年 / 年中",
    match: (input: PlanningInput) => input.occupancyPhase === '已入住' && input.feePhase === '收费多年' && input.node === '年中',
    template: "【年中回馈】[小区名称]智慧物业升级，线上缴费领好礼！\n\n尊贵的业主：时值年中，[物业公司]为您送上便捷礼包！小程序缴费功能现已上线，账单明细一目了然。[限时福利]：即日起至[截止日期]注册小程序，即可领取百元优惠券。感谢您半年来对我们工作的理解与支持！\n\n[物业公司]\n[日期]"
  },
  {
    id: 7,
    description: "已入住 / 收费多年 / 10月1日",
    match: (input: PlanningInput) => input.occupancyPhase === '已入住' && input.feePhase === '收费多年' && input.node === '10月1日',
    template: "【双节献礼】[小区名称]线上缴费上线，长假出行缴费不愁！\n\n尊贵的业主：值此国庆佳节，为不耽误您的假期时光，我们特上线小程序缴费功能。无论您身处何方，均可随时缴纳物业费。[限时福利]：即日起至[截止日期]注册小程序，即可领取百元优惠券。祝您节日愉快！\n\n[物业公司]\n[日期]"
  },
  {
    id: 8,
    description: "已入住 / 收费多年 / 自然年度届满日",
    match: (input: PlanningInput) => input.occupancyPhase === '已入住' && input.feePhase === '收费多年' && input.node === '自然年度届满日',
    template: "【跨年通知】新年新气象，[小区名称]线上缴费焕新出发！\n\n尊贵的业主：新年伊始，[物业公司]祝您万事如意。为简化年度缴费流程，官方小程序缴费系统今日正式启用。[限时福利]：即日起至[截止日期]注册小程序，即可领取百元优惠券。感谢您陪伴我们步入新的一年！\n\n[物业公司]\n[日期]"
  },
  {
    id: 9,
    description: "已入住 / 刚开始收费 / 年中",
    match: (input: PlanningInput) => input.occupancyPhase === '已入住' && input.feePhase === '刚开始收费' && input.node === '年中',
    template: "【通知】[小区名称]服务升级，线上缴费助力智慧社区\n\n尊贵的业主：为提升物业服务效能，我们已完成缴费系统的线上迁移。即日起，您可随时随地通过微信查询并缴纳物业费。[限时福利]：即日起至[截止日期]注册小程序，即可领取百元优惠券。感谢您的配合！\n\n[物业公司]\n[日期]"
  },
  {
    id: 10,
    description: "已入住 / 收费多年 / 普通日期",
    match: (input: PlanningInput) => input.occupancyPhase === '已入住' && input.feePhase === '收费多年' && input.node === '普通日期',
    template: "【便民通知】[小区名称]微信小程序线上缴费正式运行！\n\n尊贵的业主：应广大业主需求，我司现已开通微信小程序线上缴费功能。免排队、零接触，让缴费更安全便捷。[限时福利]：即日起至[截止日期]注册小程序，即可领取百元优惠券。欢迎您扫码体验。\n\n[物业公司]\n[日期]"
  }
];

export const generateNotice = (input: PlanningInput) => {
  const scenario = SCENARIOS.find(s => s.match(input)) || SCENARIOS[0];
  let content = scenario.template;
  
  const now = new Date();
  const year = now.getFullYear();
  
  content = content.replace(/\[小区名称\]/g, input.communityName);
  content = content.replace(/\[物业公司\]/g, input.propertyName);
  content = content.replace(/\[截止日期\]/g, input.deadline);
  content = content.replace(/\[年份\]/g, year.toString());
  content = content.replace(/\[日期\]/g, now.toLocaleDateString('zh-CN'));
  
  return content;
};

export const exportToWord = async (title: string, content: string) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: title,
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        ...content.split('\n').map(line => 
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                size: 24,
              }),
            ],
            spacing: { before: 200 },
          })
        ),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title}.docx`);
};
