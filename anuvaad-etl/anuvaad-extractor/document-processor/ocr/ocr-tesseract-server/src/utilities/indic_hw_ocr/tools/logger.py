from colorama import init
from torch.utils.tensorboard import SummaryWriter
import os


class Writer(object):
    def __init__(self, lr, nepoch,
                 logdir="/ssd_scratch/cvit/santhoshini/results/" ,
                 use_tb=False,
                 debug=False):
        self.tr_loss = None
        self.val_loss = None
        self.best_wer = None
        self.latest_wer = None
        self.best_model = None
        self.lr = lr
        self.nepoch = nepoch
        self.epoch = 0
        self.print_cnst = '\033[11A'
        self.use_tb = use_tb
        self.iterations = 0
        self.nbatches = 0
        self.batch = 0
        self.log_obj = open(logdir+'log.txt', 'a')
        self.pred_obj = None
        self.debug = debug

        init()
        self.update()
        if self.use_tb:
            self.tb_writer = SummaryWriter(log_dir=logdir)

    def update(self):
        if self.debug:
            return
        print('-'*100)
        print('  Learning Rate : {:<30}'.format(self.lr))
        print('  Best WER      : {:<10}  Best Model   : {:<10}'.format(str(self.best_wer), str(self.best_model)))
        print()
        print('  Current Epoch : {:<10}  Total Epochs  : {:<10}'.format(self.epoch, self.nepoch))
        print('  Current Batch : {:<10}  Total Batches : {:<10}'.format(self.batch, self.nbatches))
        print('  Current Training Loss  : {:<20}'.format(str(self.tr_loss)))
        print('  Latest Validation Loss : {:<20}'.format(str(self.val_loss)))
        print('  Latest Validation WER  : {:<20}'.format(str(self.latest_wer)))
        print('-'*100)
        if self.pred_obj:
            # self.print_cnst = '\033[{}A'.format(11+3+10)
            print('   {0:<33}    {1:<20}  {2:<20}'.format('CTC Preds', 'Decoded Preds', 'GT'))
            print('   '+'_'*75)
            for raw_pred, pred, gt in zip(self.pred_obj[0], self.pred_obj[1], self.pred_obj[2]):
                print('   {0:<33} => {1:<20}  {2:<20}'.format(raw_pred, pred, gt))
            print('-'*100)


    def update_trloss(self, value):
        self.tr_loss = value
        # print(self.print_cnst)
        self.update()

        if self.use_tb:
            self.tb_writer.add_scalar('Loss/train', self.tr_loss, self.iterations)


    def update_valloss(self, value1, value2):
        self.val_loss = value1
        self.latest_wer = value2
        # print(self.print_cnst)
        self.update()

        self.log_obj.write('Test loss: {0}, WER: {1} \n'.format(
                           self.val_loss, self.latest_wer))
        if self.use_tb:
            self.tb_writer.add_scalar('Loss/val', self.val_loss, self.iterations)
            self.tb_writer.add_scalar('WER/val', self.latest_wer, self.iterations)

    def update_best_er(self, value1, value2):
        self.best_wer = value1
        self.best_model = value2
        # print(self.print_cnst)
        self.update()
        self.log_obj.write('Saved model at iteration {}\n'.format(self.iterations))

        if self.use_tb:
            self.tb_writer.add_text('Best Model', str(valWER))
            self.tb_writer.add_text('Best Model Iter', str(self.iterations))

    def update_lr(self, lr):
        self.lr = lr
        # print(self.print_cnst)
        self.update()
        self.log_obj.write('LR at iteration {} is {}\n'.format(self.iterations, self.lr))

        if self.use_tb:
            self.tb_writer.add_text('Learning Rate', str(self.lr))

    def log_preds(self, raw_preds, sim_preds, cpu_texts):
        self.pred_obj = [raw_preds, sim_preds, cpu_texts]
        for raw_pred, pred, gt in zip(raw_preds, sim_preds, cpu_texts):
            self.log_obj.write('{0} => {1}, gt: {2}\n'.format(raw_pred, pred, gt))

    def end(self):
        self.log_obj.close()
        return
