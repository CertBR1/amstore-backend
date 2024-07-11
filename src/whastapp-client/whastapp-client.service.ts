import { HttpException, Injectable } from '@nestjs/common';
import { CreateWhastappClientDto } from './dto/create-whastapp-client.dto';
import { UpdateWhastappClientDto } from './dto/update-whastapp-client.dto';
import { WhastappClient } from './entities/whastapp-client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AxiosClientService } from 'src/axios-client/axios-client.service';

@Injectable()
export class WhastappClientService {
  constructor(
    @InjectRepository(WhastappClient)
    private whastappClientRepository: Repository<WhastappClient>,
    private axiosClient: AxiosClientService

  ) { }
  create(createWhastappClientDto: CreateWhastappClientDto) {
    try {
      const whastappClient = this.whastappClientRepository.create(createWhastappClientDto);
      return this.whastappClientRepository.save(whastappClient);
    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao criar painel', 500);
    }
  }
  async enviarMensagem(dados: { number: string, body: string }): Promise<any> {
    try {
      console.log(dados);
      const configuraçoes = await this.whastappClientRepository.find({ where: { status: true } });
      for (let i = 0; i < configuraçoes.length; i++) {
        console.log(configuraçoes[i]);
        const config = configuraçoes[i];
        const url = config.whatsappUrl;
        const token = config.whatsappKey;
        console.log(url, token);
        const resposta = await this.axiosClient.post(url, { "Authorization": `Bearer ${token}`, "X-Token": token }, dados);
        console.log(resposta);
        if (resposta.status === 200) {
          return resposta.data;
        }
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao enviar mensagem no painel', 500);
    }
  }

  findAll() {
    return `This action returns all whastappClient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} whastappClient`;
  }

  update(id: number, updateWhastappClientDto: UpdateWhastappClientDto) {
    return `This action updates a #${id} whastappClient`;
  }

  remove(id: number) {
    return `This action removes a #${id} whastappClient`;
  }
}
