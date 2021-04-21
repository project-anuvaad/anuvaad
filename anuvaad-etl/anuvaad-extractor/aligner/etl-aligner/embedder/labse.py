#!/bin/python
import logging
from anuvaad_auditor.loghandler import log_info
from sentence_transformers import SentenceTransformer,models
from configs.alignerconfig import labse_folder_path
# from sklearn.decomposition import PCA
# import torch

# model = SentenceTransformer(labse_folder_path)
model = SentenceTransformer(labse_folder_path, device='cuda')
# model = SentenceTransformer("/home/aswin/Downloads/LaBSE")

# use_pca = True
# pca_dimensions = 128
# num_train_sent = 2000
log = logging.getLogger('file')

class Labse:

    def __init__(self):
        pass

    def vecotrize_sentences_labse(self, source, target, src_loc, trgt_loc, object_in):

        # if(use_pca):
            # train_sent = []
            # for line_source, line_target in zip(source, target):
            #     sentence = line_source.strip()
            #     train_sent.append(sentence)

            #     sentence = line_target.strip()
            #     train_sent.append(sentence)

            #     if len(train_sent) >= num_train_sent:
            #         break

            # log_info("LaBSE:  Encode training embeddings for PCA", object_in)
            # train_matrix = model.encode(train_sent, show_progress_bar=True, convert_to_numpy=True)
            # log_info("LaBSE:  Training embedding encoding for PCA: Done.", object_in)


            # pca = PCA(n_components=pca_dimensions)
            # pca.fit(train_matrix)
            # dense = models.Dense(in_features=model.get_sentence_embedding_dimension(), out_features=pca_dimensions, bias=False, activation_function=torch.nn.Identity())
            # dense.linear.weight = torch.nn.Parameter(torch.tensor(pca.components_))
            # model.add_module('dense', dense)
            # log_info("LaBSE:  Training module addition for PCA: Done.", object_in)


        log_info("LaBSE: Encoding Source sentences", object_in)
        log_info("LaBSE: Text Locale: " + src_loc, object_in)
        embeddings_source = model.encode(source, show_progress_bar=True, convert_to_numpy=True)
        log_info("LaBSE: Source Encoding Done.", object_in)

        log_info("LaBSE: Encoding Target sentences", object_in)
        log_info("LaBSE: Text Locale: " + trgt_loc, object_in)
        embeddings_target = model.encode(target, show_progress_bar=True, convert_to_numpy=True)
        log_info("LaBSE: Target Encoding Done.", object_in)

        return embeddings_source, embeddings_target