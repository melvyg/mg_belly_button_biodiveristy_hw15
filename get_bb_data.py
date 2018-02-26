import pandas as pd
import json as json
import os

select_columns = ['AGE', 'BBTYPE', 'ETHNICITY', 'GENDER',  'LOCATION', 'SAMPLEID']

def bb_sample_names():
    bb_samples_df = pd.read_csv("belly_button_biodiversity_samples.csv")
    bb_names_list = list(bb_samples_df.columns.values)[1:]
    return bb_names_list

def otu_desc():
    otu_df = pd.read_csv("belly_button_biodiversity_otu_id.csv")
    return list(otu_df['lowest_taxonomic_unit_found'])

def get_metadata_sample(sample):
    meta_df = pd.read_csv("Belly_Button_Biodiversity_Metadata.csv")
    sample_id = int(sample.lower().strip('bb_'))
    return meta_df.loc[(meta_df['SAMPLEID'] == sample_id)][select_columns].to_dict('records')

def get_wfreq_sample(sample):
    meta_df = pd.read_csv("Belly_Button_Biodiversity_Metadata.csv")
    sample_id = int(sample.lower().strip('bb_'))
    return int(meta_df.loc[(meta_df['SAMPLEID'] == sample_id)]['WFREQ'])

def sorted_id_samples(sample):
    otu_df = pd.read_csv("belly_button_biodiversity_otu_id.csv")
    bb_samples_df = pd.read_csv("belly_button_biodiversity_samples.csv")
    bb_samples_select_df = bb_samples_df[['otu_id',sample]]
    sorted_df = bb_samples_select_df.sort_values(sample,ascending=False)
    sorted_df.rename(columns={sample:'sample_values'}, inplace=True)

    merge_df = pd.merge(sorted_df, otu_df, on="otu_id")
    merge_df.rename(columns={'lowest_taxonomic_unit_found':'otu_desc'}, inplace=True)

    sorted_dict = merge_df[0:3673].to_dict(orient='list')
    sorted_list = [sorted_dict]

    return sorted_list

