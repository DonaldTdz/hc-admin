import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase, } from '@shared/app-component-base';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { ContractService, ContractDetailService, ProjectService, PurchaseService } from 'services'
import { Contract, ContractDetail } from 'entities'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateOrUpdateContractdetailComponent } from './create-or-update-contractdetail/create-or-update-contractdetail.component'
import { UploadFile, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent extends AppComponentBase implements OnInit {
  loading = "false";
  @Input() projectId;
  @Input() purchaseId;
  refIdDisabled = false;
  form: FormGroup;
  contractDetails = [];
  readyEmployeeIds: any;
  refList: any;
  uploadDisabled = false;
  attachments = [];
  contractType = [{ text: '销项', value: 1 }, { text: '进项', value: 2 }];
  contractCodeType = [{ text: '软件', value: 2 }, { text: '硬件', value: 1 }];
  postUrl: string = '/File/DocFilesPostsAsync';
  uploadLoading = false;
  contract: Contract = new Contract();
  constructor(injector: Injector, private contractService: ContractService, private nzMessage: NzMessageService
    , private fb: FormBuilder, private contractDetailService: ContractDetailService
    , private projectService: ProjectService, private purchaseService: PurchaseService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      type: [null, Validators.compose([Validators.required])],
      codeType: [null, Validators.compose([Validators.required])],
      contractCode: [null, Validators.compose([Validators.required, Validators.maxLength(35)])],
      refId: [null],
      signatureTime: [null],
      amount: [null, Validators.compose([Validators.maxLength(18)])],
      desc: [null, Validators.compose([Validators.maxLength(250)])]
    });
    if (this.purchaseId) {
      this.contract.type = 2;
      this.contract.refId = this.purchaseId;
    } else {
      this.contract.type = 1;
      this.contract.refId = this.projectId;
    }
    if (this.contract.refId)
      this.getContract();
    this.getRefList();
  }

  //查询合同
  getContract() {
    let params: any = {};
    params.Type = this.contract.type;
    params.RefId = this.contract.refId;
    this.contractService.getAll(params).subscribe((result: PagedResultDto) => {
      if (result.totalCount > 0) {
        this.contract = result.items[0];
        this.getContractDetails(this.contract.id);
        this.jointAttachments()
      }
    })
  }

  //获取自动生成的合同编号
  getCodeType() {
    if (this.contract.codeType) {
      this.contractService.getPurchaseCode(this.contract.codeType).subscribe((resule) => {
        this.contract.contractCode = resule;
      });
    }
  }

  //查询合同明细
  getContractDetails(contractId: any) {
    this.loading = 'true';
    let params: any = {};
    params.ContractId = contractId;
    params.Type = this.contract.type;
    this.contractDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = "false"
      this.contractDetails = result.items;
    })
  }

  getRefList() {
    if (this.contract.type == 1)
      this.getProjectList();
    else
      this.getPurchaseList();
  }

  //获取项目下拉列表
  getProjectList() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.refList = result;
    });
  }

  //获取采购下拉列表
  getPurchaseList() {
    this.purchaseService.getDropDownDtos().subscribe((result) => {
      this.refList = result;
    });
  }

  save() {
    // if (this.contract.id) {
    this.contractService.createOrUpdate(this.contract).finally(() => {
    }).subscribe((result: any) => {
      if (result.code == 1) {
        this.notify.success(result.msg);
        this.contract = result.data;
      } else {
        this.notify.error(result.msg);
      }
    });
  }

  //处理附件
  jointAttachments() {
    if (this.contract.attachments) {
      let items = this.contract.attachments.split(",");
      let arr = [];
      for (let item of items) {
        let fileName = item.split(":")[0];
        let fileUrl = item.split(":")[1];
        let map = { "fileName": fileName, "fileUrl": fileUrl };
        arr.push(map);
      }
      this.attachments = arr;
    } else {
      this.attachments = []
    }
    if (this.attachments.length >= 6)
      this.uploadDisabled = true;
    else
      this.uploadDisabled = false;
  }

  beforeUpload = (): boolean => {
    if (this.uploadLoading) {
      this.notify.info('正在上传中');
      return false;
    }
    this.uploadLoading = true;
    return true;
  }

  handleChange = (info: { file: UploadFile }): void => {
    if (info.file.status === 'error') {
      this.notify.error('上传文件异常，请重试');
      this.uploadLoading = false;
    }
    if (info.file.status === 'done') {
      this.uploadLoading = false;
      var res = info.file.response.result;
      if (res.code == 0) {
        this.notify.success('上传文件成功');
        let fileName = res.data.name;
        let filePath = res.data.url;
        if (this.contract.attachments)
          this.contract.attachments = this.contract.attachments + "," + fileName + ":" + filePath;
        else
          this.contract.attachments = fileName + ":" + filePath;
        this.jointAttachments()
      } else {
        this.notify.error(res.msg);
      }
    }
  }

  //删除附件
  deleteAttachment(item: any) {
    let dateleString = "," + item.fileName + ":" + item.fileUrl;
    let items = this.contract.attachments.replace(dateleString, '');
    if (this.contract.attachments == items) {
      dateleString = item.fileName + ":" + item.fileUrl + ",";
      items = this.contract.attachments.replace(dateleString, '');
      if (this.contract.attachments == items) {
        dateleString = item.fileName + ":" + item.fileUrl;
        items = this.contract.attachments.replace(dateleString, '');
        this.contract.attachments = items;
        this.jointAttachments();
      } else {
        this.contract.attachments = items;
        this.jointAttachments();
      }
    } else {
      this.contract.attachments = items;
      this.jointAttachments();
    }
  }

  //创建合同明细
  createContractDetail() {
    if (!this.contract.id) {
      return this.nzMessage.warning("请先保存合同")
    }
    this.modalHelper.open(CreateOrUpdateContractdetailComponent, { contractId: this.contract.id, refId: this.contract.refId, contractType: this.contract.type }, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe((result: any) => {
      // if (!this.contract.id) {
      //   this.contractDetails.push(result);
      // } else {
      this.getContractDetails(this.contract.id);
      this.getContract();
      // }
    });
  }

  //编辑合同明细
  editDing(contractDetail: ContractDetail, index: number) {
    // if (!this.contract.id) {
    //   this.modalHelper.open(CreateOrUpdateContractdetailComponent, { contractDetail, refId: this.contract.refId, contractType: this.contract.type }, 'md', {
    //     nzMask: true
    //   }).subscribe((result: any) => {
    //     if (!this.contract.id) {
    //       this.contractDetails.splice(index, 1, result)
    //     }
    //   });
    // } else {
    this.modalHelper.open(CreateOrUpdateContractdetailComponent, { id: contractDetail.id, refId: this.contract.refId, contractType: this.contract.type }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getContractDetails(this.contract.id);
        this.getContract();
      }
    });
    // }
  }

  //删除
  delete(contractDetail: ContractDetail, index: number) {
    if (contractDetail.id) {
      this.message.confirm(
        "是否删除该合同明细?",
        "信息确认",
        (result: boolean) => {
          if (result) {
            this.contractDetailService.delete(contractDetail.id).subscribe(() => {
              this.notify.success('删除成功！');
              this.getContractDetails(this.contract.id);
            });
          }
        }
      )
    } else {
      this.contractDetails.splice(index, 1)
    }
  }

}
